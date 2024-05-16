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

- Tên: Nguyễn Văn A

- Tuổi: 30

- Nghề nghiệp: Scrum Master

- Công ty: Công ty phần mềm nhỏ - Start-up

- Mục tiêu: Giúp đội phát triển phần mềm hoàn thành sản phẩm được giao một cách hiệu quả và đúng hạn.

- Khó khăn:
	- Quản lý tiến độ và công việc của nhiều dự án cùng lúc.

	- Thiếu khả năng nắm bắt toàn cảnh các vấn đề và tiến độ của dự án.

	- Giao tiếp khó khăn giữa các thành viên trong đội.

	- Khó khăn trong việc theo dõi và phân bổ tài nguyên cho các dự án.

- Cần giải pháp:

	- Công cụ quản lý dự án trực quan, dễ sử dụng, giúp A theo dõi tiến độ và công việc của các dự án.

	- Công cụ có khả năng tạo và quản lý từng workspace cho từng công việc , từng dự án của workspace và từng issue của dự án một cách linh hoạt và riêng biệt.

	- Khả năng phân công nhiệm vụ và theo dõi tiến độ của từng thành viên trong đội.

- Sử dụng agile-line

	- A sử dụng agile-line để:

		- Tạo và quản lý các workspace cho các dự án khác nhau.

		- Tạo các issue cho các vấn đề, yêu cầu và nhiệm vụ cần thực hiện.

		- Phân công nhiệm vụ cho các thành viên trong đội và theo dõi tiến độ của họ.

	- Lợi ích:

		- Giúp A quản lý dự án một cách hiệu quả và dễ dàng.

		- Giảm thiểu rủi ro chậm trễ và thất bại của dự án.

		- Tăng cường sự minh bạch và phối hợp giữa các thành viên trong đội.

		- Nâng cao năng suất và hiệu quả của đội phát triển phần mềm.

- Kết luận:

	- A là một người sử dụng điển hình của agile-line bằng issue, project và workspace. Ứng dụng giúp A quản lý công việc hiệu quả và giải quyết các vấn đề liên quan đến quản lý dự án một cách dễ dàng.
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
