# notes

- use `npm run commit <msg>` to commit w/ version update
- change api/redirect addresses in `src/components/Profile.js`

## todo:

- going to need to address 'allow ternary'
https://eslint.org/docs/rules/no-unused-expressions

## idiosyncrasies (dumb shit to remember)

- For material-ui-pickers v3 use v1.x version of @date-io adapters.

- Framer v5 (and other libraries) has an issue with the react-scripts (CRA) version I'm on
    - going down a framer version gets ride of drag (the whole point of it)
    - upgrading CRA causes a whole bunch of shit
    - SOLUTION: overrides via react-app-rewired (root: config-overrides.js)
    //https://github.com/framer/motion/issues/1307
    //https://github.com/reactioncommerce/reaction-component-library/issues/399#issuecomment-467860022

## unused components (POCs)

- src/components/utility/CssFade
    - use state to control simple css fade transition

- src/components/utility/CustomScroll
    - attempt at implementing customScrollbar

- src/components/utility/Popover.js
    - just a blank MUI Popover 


# Getting Started with Create React App Boilerplate

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
