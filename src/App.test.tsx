import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from './App';
import { ManagersListMockData } from './data/ManagersListMockData';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponseOnce(JSON.stringify(ManagersListMockData));
});

test('render ManagerSearchComponent', async () => {
  render(<App />);

  // check whether header is rendered
  const header = screen.getByText('Choose Manager');
  expect(header).toBeInTheDocument();

  // check whether search input is loaded
  const chooseManagerSearchInput = await screen.findByPlaceholderText('Choose Manager');
  expect(chooseManagerSearchInput).toBeInTheDocument();

  // clicking on search input should load the list items
  fireEvent.click(chooseManagerSearchInput);
  expect(await screen.findByText('Harriet McKinney')).toBeVisible();

  // change search input value to wong. List items should be filtered and on click of Eugene Wong search input value should be set
  fireEvent.change(chooseManagerSearchInput, { target: { value: 'wong' } });
  expect(await screen.queryByText('Harriet McKinney')).toBeNull();
  const managerMenuItem = await screen.findByText('Eugene Wong');
  expect(managerMenuItem).toBeInTheDocument();
  fireEvent.click(managerMenuItem);
  expect(chooseManagerSearchInput).toHaveValue('Eugene Wong');

}, 10000);
