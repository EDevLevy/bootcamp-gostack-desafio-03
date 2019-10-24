// modulo para criacao de filas de background jobs
import Bee from 'bee-queue';
import SubscriptionMail from '../app/jobs/SubscriptionMail';
import HelpOrderMail from '../app/jobs/HelpOrderMail';
import redisConfig from '../config/redis';

const jobs = [SubscriptionMail, HelpOrderMail];

class Queue {
  constructor() {
    this.queues = [];
    this.init();
  }

  /**
   * Start jobs queues
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
