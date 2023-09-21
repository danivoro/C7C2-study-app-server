# Study Resource Catalog - Backend App

## About Study Resource Catalog

### Documentation

You can find the complete documentation for all the endpoints here:

[Postman Documentation](https://documenter.getpostman.com/view/29720498/2s9YC4VtNP)

📚 **Share and Share Alike**: Ever found an epic study resource that you wish you could share with your friends? Here, you can! Share your treasure troves of knowledge with your friends and fellow learners.

🔍 **Tags**: We're all about organisation. Tag resources with topics, so you can find that perfect resource in a breeze.

📝 **To-Study List**: No more losing track of what you want to study next. Add resources to your to-study list, and we'll keep them in order for you.

[Deployed Front-End](https://study-resource-catalog-app.netlify.app/)\
[Deployed Back-End](https://c7c2-study-app.onrender.com/)

### Installation

To begin, install all required packages with the following command:

    yarn

### Database setup

You can recreate our database by running the queries in `database.sql` file.

### Running locally

To launch a local server listening for HTTP requests on port 4000, use the following command:

    yarn start:dev

The server will then use the local database url, which is set in the env var `LOCAL_DATABASE_URL`

If you want to run a server against a remote db, please use the following command:

    yarn start:dev-with-remote-db

The server will then use the remote database url, which is set in the env var `DATABASE_URL`

### Environment Variables

When running or deploying the project, remember to include those environment variables:\
`DATABASE_URL`, which should be set to the URL of your remote db\
`LOCAL_DATABASE_URL`, which should be set to the URL of your local db\
`PORT`, which should be set to the port to your liking

e.g.

```
DATABASE_URL=postgres://someuser:somebigsecretpassword@somedbhost/pastebin
LOCAL_DATABASE_URL=postgres://user@localhost/project
PORT=4000
```

You can do it in `.env` file or in the settings of your deployed app.
