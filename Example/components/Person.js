
const Component = require('../../').Component;

class Person extends Component {

  * create (name, gender = 'male') {
    if(!name) throw new Error(`name is required, but got ${name}`);
    if(!['male', 'female'].includes(gender)) throw new Error(`gender must be male or female, but got ${gender}`);
    return yield Person.Model({
      _id: this._id,
      name,
      gender
    }).save();
  }

  static * list ({page = 1, limit = 20} = {}) {
    return yield Person.Model.find().skip((page - 1) * limit).limit(limit);
  }

  * sayHello (friend) {
    if(!friend) throw new Error('friend is required!');
    const person = yield this.getEntity();
    return `${person.name} say hello to ${friend}`;
  }

  * updateName (name) {
    const person = yield this.getEntity();
    if(!person) throw new Error(`Person with id [${this._id}] is not exists`);
    person.name = name;
    // console.log('it takes a loooooooong time');
    // yield new Promise(resolve => setTimeout(resolve, 5000));
    return yield person.save();
  }
}

Person.type = 'Person';
Person.description = 'Person component';
Person.Model = require('../models/Person');

module.exports = Person;

