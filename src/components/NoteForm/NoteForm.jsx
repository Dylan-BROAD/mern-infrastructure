import { useState } from 'react';

export default function NoteForm({ handleNoteForm }) {
    const [text, setText] = useState('');

    function handleSubmit(evt) {
        evt.preventDefault();
        console.log('Submitting note:', text);
        console.log(handleNoteForm)
        handleNoteForm(text);
        setText('');
    }

    function handleChange(evt) {
        setText(evt.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Add a new note"
                required
            />
            <button type="submit">Add Note</button>
        </form>
    );
}