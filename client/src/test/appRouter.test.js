import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

test('renders App without errors', () => {
    render(<App />);
    // Ваш код проверки, если необходимо
});