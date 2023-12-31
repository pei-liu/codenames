import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Card from './Card'

it('renders card text', () => {
  const props = {
    onCardSelect: jest.fn(),
    type: 'red',
    title: 'FIRE',
    isSelected: false,
    index: 0,
    role: 'player',
    gameWinner: false
  }
  render(<Card {...props} />)

  const element = screen.getByText('FIRE')
  expect(element).toBeDefined()
})
