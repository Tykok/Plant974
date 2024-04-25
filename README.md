# Planttreerun Scrapper 🌱🇷🇪

<center>
  <img src="https://www.espritparcnational.com/sites/default/files/styles/vignette_presse/public/2021-01/BD_Valle%CC%81e%20de%20Takamaka%20%C2%A9%20Yannick%20Riet%20%E2%80%93%20Parc%20national%20de%20La%20Re%CC%81union.jpg?h=47b8c2cd&itok=FQ585iVl" height="200">
</center>


This is a project I created for an exam. The goal of this project is simple:

- Retrieve data from the [Planttreerun site](http://publish.plantnet-project.org/project/planttreerun)
- Save them to a database
- Create a graph using the data in the database

## The project
### Scrapper

To retrieve data from the website, I used [JSDOM](https://github.com/jsdom/jsdom) to manipulate and retrieve text and images from each page.
I also used [Jimp](https://www.npmjs.com/package/jimp), which allowed me to manipulate the images and retrieve the table data in a usable format.

<center>

![Image example](https://arbres-reunion.cirad.fr/var/arbres_reunion/storage/images/especes/rubiaceae/bertiera_rufa_pheno/34190-1-fre-FR/bertiera_rufa_pheno1_reference.jpg)

</center>

### Redis

The aim was to use a NoSQL database. I chose Redis, as it's very easy to use.

Thanks to it, I was able to simply store the data I wanted to retrieve later on my Grafana.

### Grafana

Not being a Grafana expert and having limited time, I've limited myself to 2 very simple graphics.

The first compares the number of protected species with the others.
A second to display the different families grouped together.

> I didn't do any filtering or queries on the Grafana side because I was limited by time. I simply saved the data directly structured on the Redis side for use directly on Grafana.

## Run the project

To launch the project, all you need is docker.

First, add this to your `.env` file:

```bash
NODE_ENV="development"
WEBSITE_BASE_URL="https://arbres-reunion.cirad.fr"
REDIS_URL="redis://:@redis:6379/0"
```

Then run this command:

```bash
docker-compose up
```

Then you need to go to Grafana at http://localhost:3001 and follow the steps below: 

- Go to [Plugins and data > Plugins](http://localhost:3001/plugins)
- Search for Redis, and install the [plugin](https://redisgrafana.github.io/)
- Add a [new data source](http://localhost:3001/connections/datasources/new), select Redis, and fill in the fields with the following values:
  - URL: redis://:@redis:6379/0
  - Name: redis-datasource
- Save the datasource
- Go to Dashboard to [import one](http://localhost:3001/dashboard/import)
- Retrieve and insert the project's JSON

You'll then have the two graphs I've built.

