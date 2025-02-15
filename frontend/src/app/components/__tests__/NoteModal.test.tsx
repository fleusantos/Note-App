import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoteModal from '../NoteModal'

describe('NoteModal', () => {
  const mockOnClose = jest.fn()
  const mockOnSave = jest.fn()
  const mockCategory = {
    id: '1',
    name: 'Test Category',
    color: '#000000'
  }
  const mockCategories = [
    mockCategory,
    {
      id: '2',
      name: 'Another Category',
      color: '#ffffff'
    }
  ]
  
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    selectedCategory: mockCategory,
    categories: mockCategories,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the modal when isOpen is true', () => {
    render(<NoteModal {...defaultProps} />)
    expect(screen.getByPlaceholderText('Note Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Write your note here...')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<NoteModal {...defaultProps} />)
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onSave with form data when filled and closed', () => {
    render(<NoteModal {...defaultProps} />)
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Note Title'), {
      target: { value: 'Test Note' },
    })
    fireEvent.change(screen.getByPlaceholderText('Write your note here...'), {
      target: { value: 'Test Content' },
    })

    // Close the modal
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Test Note',
      content: 'Test Content',
      categoryId: mockCategory.id,
    })
  })

  it('pre-fills form when existingNote is provided', () => {
    const existingNote = {
      id: '1',
      title: 'Existing Title',
      content: 'Existing Content',
      categoryId: '2'
    }
    
    render(<NoteModal {...defaultProps} existingNote={existingNote} />)
    
    expect(screen.getByPlaceholderText('Note Title')).toHaveValue('Existing Title')
    expect(screen.getByPlaceholderText('Write your note here...')).toHaveValue('Existing Content')
  })

  it('allows category selection from dropdown', () => {
    render(<NoteModal {...defaultProps} />)
    
    // Open dropdown
    fireEvent.click(screen.getByText(mockCategory.name))
    
    // Select another category
    fireEvent.click(screen.getByText('Another Category'))
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('Note Title'), {
      target: { value: 'Test Note' },
    })
    fireEvent.change(screen.getByPlaceholderText('Write your note here...'), {
      target: { value: 'Test Content' },
    })
    
    // Close the modal to trigger save
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Test Note',
      content: 'Test Content',
      categoryId: '2',
    })
  })
})
