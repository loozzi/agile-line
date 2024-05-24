<div align="center">
	<h1>AgileLine</h1>
	<p>
		<b>AgileLine - A website project management </b>
	</p>
	<!-- Badges -->
	<p>
	<a href="https://github.com/loozzi/agile-line/graphs/contributors">
		<img src="https://img.shields.io/github/contributors/loozzi/agile-line" alt="contributors" />
	</a>
	<a href="">
		<img src="https://img.shields.io/github/last-commit/loozzi/agile-line" alt="last update" />
	</a>
	<a href="https://github.com/loozzi/agile-line/network/members">
		<img src="https://img.shields.io/github/forks/loozzi/agile-line" alt="forks" />
	</a>
	<a href="https://github.com/loozzi/agile-line/stargazers">
		<img src="https://img.shields.io/github/stars/loozzi/agile-line" alt="stars" />
	</a>
	<a href="https://github.com/loozzi/agile-line/issues/">
		<img src="https://img.shields.io/github/issues/loozzi/agile-line" alt="open issues" />
	</a>
	</p>
	
<h4>
	<a href="https://agile-line-client.vercel.app/" target="_blank">View Demo</a>
<span> · </span>
	<a href="https://judicial-clovis-loozzi-3e24b8b7.koyeb.app/api" target="_blank">API Demo</a>
<span> · </span>
	<a href="https://github.com/loozzi/agile-line/issues/">Report Bug</a>
<span> · </span>
	<a href="https://github.com/loozzi/agile-line/issues/">Request Feature</a>
</h4>
</div>

## About the Project

<p>
		AgileLine is a website that supports teams in managing all projects across various fields by providing tools to track the progress of specific projects through issue management. It facilitates a more systematic development of projects, empowering team members with increased responsibility for their projects and enabling a comprehensive review of the entire project development process for the team

</p>

## Technology

- **Frontend:**
  - ReactJs, TypeScript
  - Evergreen UI
  - Redux Toolkit + Saga
- **Backend:**
  - Python
  - Flask, SqlAlchemy
  - MySQL
- **Security and Authentication**
  - JSON Web Tokens, OAuth

## Feature

## Installation

Clone repository

```
git clone https://github.com/loozzi/agile-line.git
```

Go to folder

```
cd agile-line
```

### Backend

```
cd backend
```

Install python and module

```
pip install -r requirements.txt
```

Config environment and run

<details>
<summary>Environment config (.env)</summary>

```
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://<username>:<password>@<host>/<database>?charset=utf8mb4'
SECRET_KEY=<key>
EMAIL_MAIL=<email>
EMAIL_PASSWORD=<password>
EMAIL_HOST=<host>
EMAIL_PORT=465
```

</details>
Create database

```
flask db upgrade
```

Run server

```
python app.py
```

### Frontend

```
cd frontend
```

Install nodejs and module

```
yarn
```

or

```
npm install
```

<details>
<summary>Environment config (.env)</summary>

```
REACT_APP_API_ENDPOINT=<api>
```

</details>

Run server

```
yarn dev
```

or

```
npm run dev
```
## Persona

- Name: Nguyen Van B

- Age: 30

- Occupation: Scrum Master

- Company: Small software company - start-up

- Goal:

	- Help the software development team complete assigned products efficiently and on time.

- Challenges:
	- Managing the progress and workload of multiple projects simultaneously.

	- Lacking the ability to grasp the overall picture of project issues and progress.

	- Communication difficulties between team members.

	- Difficulties in tracking and allocating resources for projects.
- Solutions Needed:

	- A visual and user-friendly project management tool that helps B track the progress and work of projects.

	- A tool capable of creating and managing separate workspaces for each task, project within a workspace, and issue within a project in a flexible and distinct way.

	- Ability to assign tasks and monitor the progress of each team member.

- Using agile-line:

	- B uses agile-line to:

		- Create and manage workspaces for different projects.

		- Create issues for problems, requests, and tasks to be completed.

		- Assign tasks to team members and track their progress.

	- Benefits:

		- Helps B manage projects efficiently and easily.

		- Minimizes risks of project delays and failures.

		- Enhances transparency and collaboration among team members.

		- Improves productivity and efficiency of the software development team.

- Conclusion:

	- B is a typical user of agile-line using issues, projects, and workspaces. The application helps B manage work effectively and resolve project management issues easily.
## Contributors

<center>
	<table>
		<th>
			<td>Full Name</td>
			<td>Email</td>
		</th>
		<tr>
			<td>1</td>
			<td>Vũ Thành Đạt</td>
			<td><a href="mailto:22022620@vnu.edu.vn">22022620@vnu.edu.vn</a></td>
		</tr>
		<tr>
			<td>2</td>
			<td>Nguyễn Trần Hải Ninh</td>
			<td><a href="mailto:22022526@vnu.edu.vn">22022526@vnu.edu.vn</a></td>
		</tr>
		<tr>
			<td>3</td>
			<td>Nguyễn Quang Thao</td>
			<td><a href="mailto:22022619@vnu.edu.vn">22022619@vnu.edu.vn</a></td>
		</tr>
		<tr>
			<td>4</td>
			<td>Nguyễn Quang Trung</td>
			<td><a href="mailto:22022665@vnu.edu.vn">22022665@vnu.edu.vn</a></td>
		</tr>
	</table>
</center>

## Demo:
link: https://youtu.be/9XL-SX-L2YQ
