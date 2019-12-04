import { Op } from 'sequelize';
import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(5),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .required()
        .min(1),
      height: Yup.number()
        .positive()
        .required()
        .min(0),
      weight: Yup.number()
        .positive()
        .required()
        .min(0),
    });

    // validate schema and return all errors messages if need
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const { name, email, age, weight, height } = req.body;

    // check if student exists
    const studentExists = await Student.findOne({ where: { email } });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const student = await Student.create({ name, email, age, weight, height });
    return res.json(student);
  }

  async index(req, res) {
    const { q } = req.query;

    const options = {};

    if (q) {
      options.where = { name: { [Op.like]: `%${q}%` } };
    }

    const students = await Student.findAll(options);
    return res.json(students);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .min(1),
    });
    const { id } = req.params;
    // validate schema and return all errors messages if need
    try {
      await schema.validate({ id }, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
    const student = await Student.findByPk(id);
    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(5),
      email: Yup.string().email(),
      age: Yup.number()
        .positive()
        .min(1),
      height: Yup.number()
        .positive()
        .min(0),
      weight: Yup.number()
        .positive()
        .min(0),
    });

    // validate schema and return all errors messages if need
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const { id } = req.params;
    const { email } = req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    const { email: _email, age, height, weight } = await student.update(
      req.body
    );

    return res.json({ id, email: _email, age, height, weight });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });
    const { id } = req.params;
    // validate schema and return all errors messages if need
    try {
      await schema.validate({ id }, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    await Student.destroy({ where: { id } });
    return res.send();
  }
}

export default new StudentController();
