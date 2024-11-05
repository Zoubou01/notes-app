'use client'

import { useState, useEffect, useCallback } from 'react'

import { v4 as uuidv4 } from 'uuid'
import { Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { Button, Card, CardContent, Typography } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'

interface Note {
  id: string
  title: string
  content: string
  lastModified: number
}

export default function EnhancedNoteApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const saveNotes = useCallback((notesToSave: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(notesToSave))
    toast.success('Notes saved!', { autoClose: 2000 })
  }, [])

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      saveNotes(notes)
    }, 1000)

    return () => clearTimeout(timer)
  }, [notes, saveNotes])

  const addNote = (e: React.FormEvent) => {
    e.preventDefault()

    if (title.trim() === '' || content.trim() === '') return

    const newNote: Note = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      lastModified: Date.now()
    }

    const updatedNotes = [...notes, newNote]

    setNotes(updatedNotes)
    saveNotes(updatedNotes)
    setTitle('')
    setContent('')
  }

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id)

    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography variant='h4'>Notes</Typography>

        <CustomTextField
          type='text'
          label='Title'
          placeholder='Note Title'
          value={title}
          color='secondary'
          onChange={e => setTitle(e.target.value)}
        />
        <CustomTextField
          multiline
          maxRows={4}
          type='text'
          label='Content'
          color='secondary'
          placeholder='Note Content'
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <Button variant='outlined' color='secondary' onClick={addNote}>
          Add Note
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4'>
        {notes.map(note => (
          <Card key={note.id}>
            <div
              className='flex flex-row items-center justify-between space-y-0 pb-2 mt-2'
              style={{ borderBottom: '1px solid #80808047' }}
            >
              <Typography paddingLeft={'1rem'}>{note.title}</Typography>
              <Button onClick={() => deleteNote(note.id)}>
                <Trash2 color='gray' className='h-4 w-4' />
              </Button>
            </div>
            <CardContent>
              <p className='text-sm text-muted-foreground'>{note.content}</p>
            </CardContent>
            {/* <CardFooter>
              <p className='text-xs text-muted-foreground'>Last saved: {formatDate(note.lastModified)}</p>
            </CardFooter> */}
          </Card>
        ))}
      </div>
    </div>
  )
}
