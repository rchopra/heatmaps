## Setup instructions
1. Get [npm](https://www.npmjs.com/get-npm)
2. Run
```
git clone https://github.com/rchopra/heatmaps.git
npm install
npm start
```
3. Visit `http://localhost:3000/` in your browser.

You can also vist [here](https://shielded-river-95027.herokuapp.com/) to use it running on Heroku.

## Screenshot
![Screenshot](/%20screenshot.png?raw=true)

## Technologies Used
My design goals for this exercise were:
* Create heatmaps that are attractive and allow for easy identification of patterns/trends
* Allow for user filtering and exploration of the detail with good performance
* Responsive (looks good on a broad range of devices and browsers)

Given these objectives, it made sense to use [D3.js](https://d3js.org/) for the charting components and [React](https://facebook.github.io/react/) for the rest of the UI (everything is served up by [node](https://nodejs.org/en/)).

No other charting library can match the power, flexibility, suite of tools, and large community D3 offers; it's the industry standard for a reason. 
Highcharts was a consideration, and it offers some impressive plugins, but being locked into certain templates or styles of charts was unappealing. 
Another bonus of dealing with the low-level parts of D3 was its integration with React components. 
This made it easy to make composable parts from D3 primitives and has very exciting implications for building out a suite of custom data visualizations.
Speaking of React, it was the choice for the UI layer mostly because it's very fast. 
I am also a very big fan of the component-based architecture which allows for much cleaner, better-encapsulated code than other JS frameworks.
And while not a consideration for this particular project, React Native as an option for building mobile apps is worth noting.
If I were starting a big project from scratch, I'd want to start here.

Finally, I used [create-react-app](https://github.com/facebookincubator/create-react-app) as boilerplate to get up and running quickly as this was just a sample exercise.
There is also some [react-bootstrap](https://react-bootstrap.github.io/) for styling of the buttons and dropdown.

## Notes
* The density dimension I chose was location.
It seemed the most natural and useful given the data. E.g. velo gets conflated with pitch type which would complicate the task for not a ton of benefit.
* I did some minor massaging of the data to remove some obvious bad data points: pitches with negative z values and intentional balls (won't have to do that much longer).
* The overlay function was my way of sanity checking that the heatmap was representing the data accurately. 
I thought it was useful enough to leave in as some may prefer to see the actual data points.

