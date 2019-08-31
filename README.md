# Boilerplate Angular - Django REST JWT login setup

When you're starting a new app, user authentication setup usually takes the most effort. This boilerplate is made so we can just skip this step and focus on the app itself.

This repo is based on the Django JWT login setup from Keith Dechant's [Angular API Calls with Django: Authentication with JWT](https://www.metaltoad.com/blog/angular-api-calls-django-authentication-jwt) and Angular authentication with HTTP interceptor from [Jason Watmore's Angular - JWT Authentication Example](https://jasonwatmore.com/post/2018/11/16/angular-7-jwt-authentication-example-tutorial#authentication-service-ts) articles. 


## Installation

You need to have `pip`, `virtualenv`, `npm`, `angular-cli` installed on your system. 

Change the repo directory name before you install any `npm` and `python` packages.
### Back-end installation

```sh
# At repo root:
virtualenv -p python3 .env
source .env/bin/activate
cd api
pip install -e requirements.txt
python manage.py migrate
```

### Front-end installation
```sh
# At repo root:
cd ng-app
npm install
```

## Notes
- Not loading Bootstrap to `index.html` to keep it lean.
- Do not forget to change the Django Security Key for production.
