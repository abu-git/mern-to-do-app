import React from 'react';
import App from '../App';
import { create } from 'react-test-renderer';

describe('Jest testing of React Components', ()=>{
	test('Testing App Component', () =>{
		let tree = create(<App />);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});