from pymongo import MongoClient
from faker import Faker
from bson.objectid import ObjectId
import random
from datetime import datetime, timedelta

fake = Faker()

# Подключение к MongoDB
client = MongoClient("mongodb://localhost:27017/skeleton-python-mongo")
db = client['skeleton-python-mongo']

# Получаем списки преподавателей и учеников
teachers = list(db.users.find({'role': 'Преподаватель'}))
students = list(db.users.find({'role': 'Студент'}))

# Функция для генерации рандомной даты в течение следующих 6 месяцев
def generate_random_future_date():
    today = datetime.now()
    # Случайное количество дней до 182 дней (примерно полгода)
    random_days = random.randint(1, 182)
    future_date = today + timedelta(days=random_days)
    return future_date

# Функция для создания проектов
def create_projects(teachers, students):
    projects = []
    for i in range(20):  # Создаем 10 проектов для примера
        teacher = random.choice(teachers)
        assigned_students = random.sample(students, k=random.randint(1, 5))  # От 1 до 5 учеников на проект
        project = {
            'title': fake.sentence(nb_words=6),
            'description': fake.text(max_nb_chars=200),
            'deadline': generate_random_future_date(),
            'status': random.choice(['В планировании', 'В процессе']),
            'assignedTeacher': str(teacher['_id']),
            'assignedStudents': [str(student['_id']) for student in assigned_students]
        }
        projects.append(project)
    return projects

projects = create_projects(teachers, students)
project_ids = db.projects.insert_many(projects).inserted_ids

# Функция для создания задач
def create_tasks(project_ids, students):
    tasks = []
    for project_id in project_ids:
        for _ in range(random.randint(1, 5)):  # От 1 до 5 задач на проект
            task = {
                'title': fake.sentence(nb_words=4),
                'description': fake.text(max_nb_chars=100),
                'projectId': str(project_id),
                'status': 'Новая',
                'priority': random.choice(['Низкий', 'Средний', 'Высокий']),
            }
            task_id = db.tasks.insert_one(task).inserted_id
            tasks.append((task_id, project_id))
    return tasks

tasks_with_project = create_tasks(project_ids, students)

# Функция для создания комментариев
def create_comments(tasks_with_project, students):
    for task_id, _ in tasks_with_project:
        for _ in range(random.randint(0, 5)):  # От 0 до 5 комментариев на задачу
            student = random.choice(students)
            comment = {
                'text': fake.text(max_nb_chars=50),
                'taskId': str(task_id),
                'authorId': str(student['_id']),
                'timestamp': datetime.now()
                # 'author': {'id': str(student['_id']), 'name': student['username'], 'email': student['email']} # TODO добавить потом
            }
            db.comments.insert_one(comment)

create_comments(tasks_with_project, students)

print("Data has been inserted successfully.")
