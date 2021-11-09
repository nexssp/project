# @nexssp/project

## NEW: Project types

Start hot reloading environment and start with different project types quickly:

For now supported project types: **vue2**. Soon: **react**, **preact**, **vue3**

```sh
nexssp-project vue2 project-name # as separate command
nexss p vue2 project-name # for nexss programmer
nexss p vue2 project-name --install # use --install to install automatically the packages.

# TODO: add tag ability (for different versions)
# TODO: add change of project name in the package.json file
# TODO: remove .git folder from the created project.
```

## Note

Nexss Programmer projects tool. This tool is a cli tool and can be used separately but also within Nexss Programmer.

You can create new projects for Nexss Programmer, but also for famous other frameworks eg. **vue**.

It allows you to keep db of your projects (not only Nexss Programmer) so you can find them easyly. It also create new Nexss Programmer's Project, display info about them etc.

You can add to the database any folder really. And then you can search for them in the by easy command `nexssp-project search some keywords` or in the Nexss Programmer ..`nexss p search ...`

## Note

This Nexss Programmer's plugin is the effect of the refactoring the Nexss Programmer **@nexssp/cli** which development has been started in 2018. This module can be used also _separately_ without the Nexss Programmer.

## Install

```sh
# Install
npm i -g @nexssp/project

# creates new project folder with default template
nexssp-project new myproject

# attach current folder to the global database. please see below
nexssp-project attach

# search your database
nexssp-project search keywords..

# displays info about project
nexssp-project info
```

Now you can use `nexssp-project`. In the Nexss Programmer it is `nexss project` or `nexss p`

## Usage

### Create db of your projects

Let say you have hundreds different projects of different kinds. This module allows you to keep track of your projects aswell of some information. For now (use `nexssp-project attach` in any folder) it will ask you for information (optional):

![image](https://user-images.githubusercontent.com/53263666/119243113-3a0d3580-bb64-11eb-9d68-712461ebb9cf.png)

- **folder** (in case you have different folders for different projects)
- **description**
- **keywords** (for searching)
- **repository**
- **code editor** (default for VSCodium)
- **extra notes** (if you need to add some extra notes to the projects, like phone numbers etc..)

### Search for the projects

Projects are saved by default in the: `<HOME>/.nexss/projects_db.json`

You can customize it by changing the environment variable of: `NEXSS_PROJECTS_DB`

### TODO

- add more detailed searching
-
