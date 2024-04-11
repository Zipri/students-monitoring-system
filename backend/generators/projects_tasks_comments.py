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
    for i in range(100):  # Создаем 10 проектов для примера
        teacher = random.choice(teachers)
        assigned_students = random.sample(students, k=random.randint(1, 5))  # От 1 до 5 учеников на проект
        deadline = generate_random_future_date()
        start_date = deadline - timedelta(days=random.randint(10, 60))  # Начало проекта от 10 до 60 дней до deadline
        project = {
            'title': fake.sentence(nb_words=6),
            'description': fake.text(max_nb_chars=200),
            'startDate': start_date.strftime('%Y-%m-%d'),
            'deadline': deadline.strftime('%Y-%m-%d'),
            'status': random.choice(['В планировании', 'В процессе', 'Отложен']),
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
        project = db.projects.find_one({'_id': ObjectId(project_id)})
        # Преобразуем строки в объекты datetime
        start_date_project = datetime.strptime(project['startDate'], "%Y-%m-%d")
        deadline_project = datetime.strptime(project['deadline'], "%Y-%m-%d")

        # Теперь можно безопасно вычислять середину интервала
        half_way_duration = (deadline_project - start_date_project) / 2
        mid_project_date = start_date_project + half_way_duration

        for _ in range(random.randint(4, 8)):  # От 1 до 5 задач на проект
            start_date_task = start_date_project + timedelta(days=random.randint(0, half_way_duration.days))
            # Убедитесь, что deadline_task также генерируется корректно, основываясь на объектах datetime
            days_until_project_deadline = (deadline_project - start_date_task).days
            deadline_task = start_date_task + timedelta(days=random.randint(1, days_until_project_deadline))

            task = {
                'title': fake.sentence(nb_words=4),
                'description': fake.text(max_nb_chars=100),
                'projectId': str(project_id),
                'status': random.choice(['Новая', 'В работе']),
                'priority': random.choice(['Низкий', 'Средний', 'Высокий']),
                'startDate': start_date_task.strftime('%Y-%m-%d'),  # Форматируем обратно в строку для сохранения
                'deadline': deadline_task.strftime('%Y-%m-%d'),
            }
            task_id = db.tasks.insert_one(task).inserted_id
            tasks.append((task_id, project_id))
    return tasks

tasks_with_project = create_tasks(project_ids, students)

# Функция для создания комментариев
def create_comments(tasks_with_project, students):
    for task_id, _ in tasks_with_project:
        for _ in range(random.randint(3, 10)):  # От 0 до 5 комментариев на задачу
            student = random.choice(students)
            # В этой реализации информация об авторе извлекается непосредственно из записи о студенте
            author_info = {
                'id':student['_id'],
                'username': student['username'],
                'email': student['email'],
                'role': student['role'],
                'group': student['group']
            }
            comment = {
                'text': fake.text(max_nb_chars=100),
                'taskId': str(task_id),
                'authorId': str(student['_id']),  # Сохраняем authorId для совместимости
                'author': author_info,  # Добавляем информацию об авторе непосредственно в документ комментария
                'timestamp': datetime.now()
            }
            db.comments.insert_one(comment)



create_comments(tasks_with_project, students)

print("Data has been inserted successfully.")
