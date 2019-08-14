"use strict";
var ObjectID   = require('mongodb').ObjectID;
var collection = 'notes';

const filters = {
    id: (id) => {
        return { _id: new ObjectID(id) };
    },
    tag: (tag) => {
        return { tags: { $regex: new RegExp(tag, 'i') } };
    },
    title: (title) => {
        return { 'title': { $regex: new RegExp(title, 'i') } };
    }
};


module.exports = (app, db) => {
  class NoteRepository {
    
    addNote(note) {
      return new Promise((resolve, reject) => {
        db.collection('project').findOne(filters.title(note.title))
        .then(noteData => {
          if (noteData) {
            reject(Error('Note already Exists'))
          } else {
            db.collection('project').insertOne(note)
            .then(result => {
              db.close()
              resolve({id: result.insertedId})
            })
            .catch(error => {
              reject(error)
            })
          }
        })
      })
    }
    findNoteById(id) {
      return new Promise((resolve, reject) => {
        db.collection('project').findOne(filters.id(id))
        .then(note => {
          resolve(note);
          db.close()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
    findNotesByTag(tag) {
      return new Promise((resolve,reject) => {
        db.collection('project').find(filters.tag(tag))
        .sort({updated_date: -1})
        .toArray()
        .then(notes => {
          resolve(notes);
          db.close();
        })
        .catch(error => {
          reject(error);
          db.close()
        })
      })
    }
    findNotesByTitle(title) {
      return new Promise((resolve, reject) => {
        db.collection('project').find(filters.title(title))
        .sort({updated_date : -1})
        .toArray()
        .then(notes => {
          resolve(notes);
          db.close()
        })
        .catch(error => {
          reject(error)
          db.close()
        })
      })
    }
    listNotes() {
      return new Promise((resolve, reject) => {
        db.collection('project').find().sort({updated_date: -1})
        .toArray().
        then(notes => {
          resolve(notes);
          db.close
        })
        .catch(error => {
          reject(error);
          db.close;
        })
      })
    }
    removeNotes(id) {
      return new Promise((resolve, reject) => {
        db.collection('project').findOneAndDelete(filters.id(id))
        .then (() => {
          resolve();
          db.close
        })
        .catch(error => {
          reject(error);
          db.close;
        })
      })
    }
    tagNote(id, tags) {
      
      const update = {
        $addToSet: {
          tags: {
            $each: tags
          }
        }
      };
      
      return new Promise((resolve,reject) => {
        db.collection('project').findOneAndUpdate(filters.id(id),
                                                 update
      )
        .then(()=> {
          resolve();
          db.close;
        })
        .catch(error => {
          reject(error);
          db.close;
        })
      })
    }
    updateNote(id, note) {
      return new Promise ((resolve, reject) => {
        db.collection('project').update(filters.id(id),
                                       {
          $set: {
            title: note.title,
            content: note.content,
            tags: note.tags,
            updated_date: note.updated_date
          }
        })
        .then(()=> {
          resolve();
          db.close;
        })
        .catch(error => {
          reject(error);
          db.close;
        })
      })
    }
  }
}

//module.exports = NoteRepository;