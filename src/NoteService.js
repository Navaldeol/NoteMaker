'use strict';

import { rejects } from "assert";
import * as axios from 'axios';

const baseApiUrl = 'https://note-manager.glitch.me/api';

const addNote = (title, content, tags = []) => {

    return new Promise((resolve, reject) => {
        axios
            .post(`${baseApiUrl}/notes`, { 
                'title': title,
                'content': content,
                'tags': tags.join() })
            .then((result) => {
                resolve(result.data);
            })
            .catch(error => {
                console.log(error);
                reject(error.message);
            });

    });

};
const findNote = (id) => {
    
    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}/notes/${id}`)
            .then(response => {
                resolve(response.data);
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });
    
};

const findNotesByTitle = (title) => {

    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}/notes?title=${title}`)
            .then(response => {
                resolve(response.data);
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};

const listNotes = () => {

    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}/notes`)
            .then(response => {
                resolve(response.data);
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};

const removeNote = (id) => {

    return new Promise((resolve, reject) => {
        axios
            .delete(`${baseApiUrl}/notes/${id}`)
            .then(() => {
                resolve();
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};

const updateNote = (note) => {
    return new Promise((resolve, reject) => {
        axios
            .put(`${baseApiUrl}/notes`, {note})
            .then(() => {
                resolve();
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });
    
};

module.exports = {
    'addNote': addNote,
    'findNote': findNote,
    'findNotesByTitle': findNotesByTitle,
    'listNotes': listNotes,
    'removeNote': removeNote,
    'updateNote': updateNote
};