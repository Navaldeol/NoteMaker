import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import Modal from 'react-modal';
var NoteService = './src/NoteService.js'


//Making a New Note Form

class addNoteForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            tags: [],
            validationErrors: []
        };
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onContentChange= this.onContentChange.bind(this);
        this.onTagsChange= this.onTagsChange.bind(this);
        this.onSave= this.onSave.bind(this);
    }

    onTitleChange(event) {
        const title = event.target.value.trim();
        this.validateTitle(title);
        this.setState({title:title});
    }
    onContentChange(event) {
        const content = event.target.value.trim();
        this.validateContent(content);
        this.setState({content: content});
    }
    onTagsChange(event) {
        const tags= event.target.value.trim();
        if (this.validateTags(tags)) {
            this.setState({tags: tags.split(',')});
        }
    }

    onSave(event) {
        event.preventDefault();
        if (this.state.validationErrors && this.state.validationErrors.length ===0) {
            const {title, content} = this.state;
            if (this.validateTitle(title) && this.validateContent(content)) {
                this.props.onSaveNote(this.state);
            }
        }
    }

    validateTitle(title) {
        const message = 'Title is Required';

        if (title === '') {
            this.addValidationError(message);
            return false
        } else {
            this.removeValidationError(message);
            return true
        }
    }
    validateContent(content) {
        const message = 'Content is required' ;

        if (content === '') {
            this.addValidationError(message);
            return false;
        } else {
            this.removeValidationError(message);
            return true;
        }
    }
    validateTags(tags) {
        const message = 'Tags must be a comma separated list';
        
        if (tags !== '') {
            var regex = new RegExp(/^([\w]+[\s]*[,]?[\s]*)+$/);

            if (!regex.test(tags)) {                
                this.addValidationError(message);
                return false;
            } else {
                this.removeValidationError(message);
                return true;
            }
        } else {
            this.removeValidationError(message);
        }
    }

    
    addValidationError(message) {        
        this.setState((previousState) => {
            const validationErrors = [...previousState.validationErrors];
            validationErrors.push({message});
            return {
                validationErrors: validationErrors
            };
        });      
    }

    
    removeValidationError(message) {
        this.setState((previousState) => {
            const validationErrors = previousState
                .validationErrors
                .filter(error => error.message !== message);
            
            return {
                validationErrors: validationErrors
            };
        });      
    }

    
    render() {

        const validationErrorSummary = this.state.validationErrors.map(error => 
            <div key={uuidv1()} className="alert alert-danger alert-dismissible fade show">
                {error.message}
                <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
            </div>
        );

        return (
            <div className="card card-body">
                <div className="mb-2">        
                    <span className="h4 my-auto"><i className="fa fa-file-text-o fa-lg"></i> New Note</span>
                    <a className="float-right ml-auto" onClick={this.props.onCloseModal}>
                        <i className="fa fa-remove fa-2x mr-2 text-danger"></i>
                    </a>
                </div>
                {validationErrorSummary}
                <form onSubmit={this.onSave} className="mt-2">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" name="title" autoFocus onChange={this.onTitleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea className="form-control" name="content" rows="3" onChange={this.onContentChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <input type="text" className="form-control" name="tags" onChange={this.onTagsChange} />
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4 col-md-3 col-xl-2 ml-auto">
                            <button type="submit" className="btn btn-success btn-lg btn-block">
                                <i className="fa fa-save mr-2"></i>Save
                            </button>
                        </div>
                        <div className="col-sm-4 col-md-3 col-xl-2">
                            <button className="btn btn-danger btn-lg btn-block mt-2 mt-sm-0"
                                onClick={this.props.onCloseModal}
                                type="button">
                                <i className="fa fa-remove mr-2"></i>Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

addNoteForm.propTypes = {
    onCloseModal: PropTypes.func,
    onSaveNote: PropTypes.func
};
 //export default AddNoteForm






 class controlPanel extends Component {
     constructor(props) {
         super (props);
         this.state = {
             title: ''
         };
         this.onSearchTitleChanged = this.onSearchTitleChanged.bind(this)
     }
     onSearchTitleChanged(event) {
         const title = event.target.value;
         this.setState({title});
     }

     render() {
         return (
             <div>
                 <div className = "input-group input-group-lg">
                     <span className= "input-group-btn">
                         <button className = 'btn btn-primary' type= "button" onClick= {this.openAddNoteModal}>
                             <i className = 'fa fa-plus'></i>
                         </button>
                     </span>
                     <input type= "text" className= 'form-control' placeholder= "Search for note by title..." value= {this.state.title} onChange= {this.onSearchTitleChanged}></input>
                     <span className= "input-group-btn">
                         <button className = "btn btn-primary" type= "button" onClick = {() => this.props.onFindNotes(this.state.title)}>
                             <i className = "fa fa-search"></i>
                         </button>
                     </span>
                 </div>
             </div>
         );
         
     }
 }

 controlPanel.propTypes = {
     openAddNoteModal: PropTypes.func,
     onFindNotes: PropTypes.func
 };







//Note Manager


class noteManager extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            notes: [],
            selectedNote: null,
            isAddNoteModalOpen: false,
            isEditNoteModalOpen: false
        };

        
        this.handleOnAddNote = this.handleOnAddNote.bind(this);
        this.handleOnEditNote = this.handleOnEditNote.bind(this);
        this.handleOnDeleteNote = this.handleOnDeleteNote.bind(this);
        this.handleOnFindNotes = this.handleOnFindNotes.bind(this);
        
        this.handleOpenAddNoteModal = this.handleOpenAddNoteModal.bind(this);
        this.handleOnCloseAddNoteModal = this.handleOnCloseAddNoteModal.bind(this);

        this.handleOpenEditNoteModal = this.handleOpenEditNoteModal.bind(this);
        this.handleOnCloseEditNoteModal = this.handleOnCloseEditNoteModal.bind(this);
    }


    componentDidMount() {
        this.listNotes();
    }


    listNotes() {
        NoteService
            .listNotes()
            .then(notes => {
                this.setState({notes});
                return;
            })
            .catch(error => {
                console.log(error);
                return;
            });
    }


    handleOnDeleteNote(noteId) {

        if (noteId < 1) {
            throw Error('Cannot remove note. Invalid note id specified');
        }
        
        const confirmation = confirm('Are you sure you wish to remove note?');

        if (confirmation) {
            NoteService
                .removeNote(noteId)
                .then(() => {
                    NoteService
                        .listNotes()
                        .then(notes => {
                            this.setState({notes});
                            return;
                        })
                        .catch(error => {
                            console.log(error);
                            return;
                        });
                })
                .catch(error => {
                    console.log(error);
                    return;
                });
        }
    }


    handleOnFindNotes(title) {
        
        if (!title || title === '') {
            this.listNotes();
            return;
        }
        
        NoteService
            .findNotesByTitle(title)
            .then(notes => {
                if (!notes) {
                    notes = [];
                }
                this.setState({notes});
                return;
            })
            .catch(error => {
                console.log(error);
                return;
            });
    }


    handleOnAddNote(note) {

        this.setState({ isAddNoteModalOpen: false });

        const { title, content, tags } = note;

        if (!title || title.length === 0) {
            throw Error('Title is required');
        }

        if (!content || content.length === 0) {
            throw Error('Content is required');
        }

        if (!Array.isArray(tags)) {
            throw Error('Tags must be an array');
        }

        NoteService
            .addNote(title, content, tags)
            .then(newNote => {             
                NoteService
                    .listNotes()
                    .then(notes => {
                        notes.forEach(n => n.id === newNote.id ? n.isNew = 'true' : n.isNew = undefined);                
                        this.setState({notes});
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => {
                console.log(error);
            });
    }


    handleOnCloseAddNoteModal() {
        this.setState({isAddNoteModalOpen: false});
    }


    handleOpenAddNoteModal() {
        this.setState({isAddNoteModalOpen: true});
    }


    handleOnCloseEditNoteModal() {
        this.setState({isEditNoteModalOpen: false});
    }


    handleOpenEditNoteModal(noteId) {

        if (!noteId || noteId < 1) {
            throw Error('Cannot edit note. Invalid note id specified.');
        }

        NoteService
            .findNote(noteId)
            .then(note => {
                this.setState({selectedNote: note});
                this.setState({isEditNoteModalOpen: true});
                return;
            })
            .catch(error => {
                console.log(error);
                return;
            });
    }


    handleOnEditNote(note) {
        this.setState({ isEditNoteModalOpen: false });
        
        const { title, content, tags } = note;
        
        if (!title || title.length === 0) {
            throw Error('Title is required');
        }
        
        if (!content || content.length === 0) {
            throw Error('Content is required');
        }
        
        if (!Array.isArray(tags)) {
            throw Error('Tags must be an array');
        }

        NoteService
            .updateNote(note)
            .then(() => {                
                NoteService
                    .listNotes()
                    .then(notes => {
                        notes.forEach(n => n.id === note.id ? n.isNew = 'true' : n.isNew = undefined);                
                        this.setState({notes});
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => {
                console.log(error);
            });
    }


    render() {
        return (
            <div>                                
                <Modal isOpen={this.state.isAddNoteModalOpen} onRequestClose={this.handleOnCloseAddNoteModal}>
                    <addNoteForm onSaveNote={this.handleOnAddNote} onCloseModal={this.handleOnCloseAddNoteModal} />
                </Modal>
                <Modal isOpen={this.state.isEditNoteModalOpen} onRequestClose={this.handleOnCloseEditNoteModal}>
                    <editNoteForm onSaveNote={this.handleOnEditNote} onCloseModal={this.handleOnCloseEditNoteModal} note={this.state.selectedNote} />
                </Modal>
                <div className="mb-3">
                    <controlPanel openAddNoteModal={this.handleOpenAddNoteModal} onFindNotes={this.handleOnFindNotes} />
                </div>
                <noteTable notes={this.state.notes} onDeleteNote={this.handleOnDeleteNote} onOpenEditNoteModal={this.handleOpenEditNoteModal} />
            </div>
        );
    }
}






const noteTable = (props) => {
    const notes = props.notes;

    const noteRows = notes.map(note => {

        let classes = `small ${!!note.isNew ? 'table-success' : ''}`;
        
        return (
            <tr key={note.id.toString()} className={classes}>
                <td className="align-middle" style={{width: '80px'}}>
                    <div className="d-flex flex-row">
                        <a data-toggle="tooltip" data-placement="top" title="Edit Note" className="p-2" onClick={() => props.onOpenEditNoteModal(note.id)}>
                            <i className="fa fa-pencil fa-lg text-primary"></i>
                        </a>
                        <a data-toggle="tooltip" data-placement="top" title="Delete Note" className="p-2" onClick={() => props.onDeleteNote(note.id)}>
                            <i className="fa fa-trash fa-lg text-danger"></i>
                        </a>
                    </div>                
                </td>
                <td className="align-middle">{note.title}</td>
                <td className="align-middle">
                    <span className="d-inline-block text-truncate" style={{maxWidth: '200px'}}>
                        {note.content}
                    </span>                
                </td>
                <td className="align-middle">{`${new Date(note.updatedDate).toISOString().slice(0, 10)} ${new Date(note.updatedDate).toISOString().slice(11, 16)}`}</td>
            </tr>
        );
    });

    return (
        <div>
            <table className="table table-bordered table-striped table-hover">
                <thead>
                    <tr>
                        <th></th>
                        <th className="align-middle text-center">Title</th>
                        <th className="align-middle text-center">Content</th>
                        <th className="align-middle text-center">Updated Date</th>
                    </tr>
                </thead>
                <tbody>
                    {noteRows}
                </tbody>
            </table>
        </div>
    );
};

noteTable.propTypes = {
    notes: PropTypes.array,
    onDeleteNote: PropTypes.func,
    onOpenEditNoteModal: PropTypes.func
};











// EDITING A NOTE FORM
class editNoteForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.note.id,
            title: props.note.title,
            content: props.note.content,
            tags: props.note.tags,
            validationErrors: []
        };

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onContentChange = this.onContentChange.bind(this);
        this.onTagsChange = this.onTagsChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    
    onTitleChange(event) {
        const title = event.target.value;

        this.validateTitle(title);

        this.setState({ title: title });
    }


    onContentChange(event) {
        const content = event.target.value;

        this.validateContent(content);
        
        this.setState({ content: content });
    }


    onTagsChange(event) {
        const tags = event.target.value;

        if (this.validateTags(tags)) {            
            this.setState({ tags: tags.split(',')});
        }        
    }

    
    onSave(event) {
        event.preventDefault();

        if (this.state.validationErrors && this.state.validationErrors.length === 0) {
            const { title, content } = this.state;
            
            if (this.validateTitle(title) && this.validateContent(content)) {
                this.props.onSaveNote({
                    id: this.state.id,
                    title: this.state.title,
                    content: this.state.content,
                    tags: this.state.tags
                });
            }
        }
    }
    

    validateTitle(title) {
        const message = 'Title is required';

        if (title === '') {
            this.addValidationError(message);
            return false;
        } else {
            this.removeValidationError(message);
            return true;
        }
    }


    validateContent(content) {
        const message = 'Content is required';

        if (content === '') {
            this.addValidationError(message);
            return false;
        } else {
            this.removeValidationError(message);
            return true;
        }
    }


    validateTags(tags) {
        const message = 'Tags must be a comma separated list';
        
        if (tags !== '') {
            var regex = new RegExp(/^([\w]+[\s]*[,]?[\s]*)+$/);

            if (!regex.test(tags)) {                
                this.addValidationError(message);
                return false;
            } else {
                this.removeValidationError(message);
                return true;
            }
        } else {
            this.removeValidationError(message);
        }
    }

    
    addValidationError(message) {        
        this.setState((previousState) => {
            const validationErrors = [...previousState.validationErrors];
            validationErrors.push({message});
            return {
                validationErrors: validationErrors
            };
        });      
    }

    
    removeValidationError(message) {
        this.setState((previousState) => {
            const validationErrors = previousState
                .validationErrors
                .filter(error => error.message !== message);
            
            return {
                validationErrors: validationErrors
            };
        });      
    }

    
    render() {

        const validationErrorSummary = this.state.validationErrors.map(error => 
            <div key={uuidv1()} className="alert alert-danger alert-dismissible fade show">
                {error.message}
                <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
            </div>
        );

        return (
            <div className="card card-body">
                <div className="mb-2">        
                    <span className="h4 my-auto"><i className="fa fa-file-text-o fa-lg"></i> Edit Note</span>
                    <a className="float-right ml-auto" onClick={this.props.onCloseModal}>
                        <i className="fa fa-remove mr-2 fa-2x text-danger"></i>
                    </a>
                </div>
                {validationErrorSummary}
                <form onSubmit={this.onSave} className="mt-2">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" name="title" autoFocus onChange={this.onTitleChange} value={this.state.title}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea className="form-control" name="content" rows="3" onChange={this.onContentChange} value={this.state.content}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <input type="text" className="form-control" name="tags" onChange={this.onTagsChange} value={this.state.tags.join(',')} />
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4 col-md-3 col-xl-2 ml-auto">
                            <button type="submit" className="btn btn-success btn-block">
                                <i className="fa fa-save mr-2"></i>Save
                            </button>
                        </div>
                        <div className="col-sm-4 col-md-3 col-xl-2">
                            <button className="btn btn-danger btn-block mt-2 mt-sm-0"
                                onClick={this.props.onCloseModal}
                                type="button">
                                <i className="fa fa-remove mr-2"></i>Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

editNoteForm.propTypes = {
    note: PropTypes.object,
    onCloseModal: PropTypes.func,
    onSaveNote: PropTypes.func
};
module.exports = {
  "addNoteForm" : addNoteForm,
  "controlPanel": controlPanel,
  "editNoteForm": editNoteForm,
  "noteManager": noteManager,
  "noteTable": noteTable
}
//export default Notes;
//export default ControlPanel;
//export default EditNoteForm;
//export default NoteMaker;