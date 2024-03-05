from pymongo import MongoClient
from faker import Faker
import random
from werkzeug.security import generate_password_hash

# Настройка Faker
fake = Faker()

# Подключение к MongoDB
client = MongoClient('mongodb://localhost:27017/skeleton-python-mongo')
db = client['skeleton-python-mongo']

# Список групп
group_names = ["ИУ6-41М", "ИУ5-63Б", "МТ11-82Б", "МТ9-11Б", "ЮР4-12Б", "Э6-12М"]

# Генерация данных для групп
groups = [{'name': name, 'students': []} for name in group_names]
db.groups.insert_many(groups)

# Генерация пользователей и добавление их в группы
for _ in range(80):
    password = fake.password(length=10)
    user_data = {
        'username': fake.user_name(),
        'email': fake.email()[:-10] + "-" + password + "-" + fake.email()[-10:],  # Вставляем пароль в email
        'password': generate_password_hash(password),
        'role': random.choice(['Студент', 'Преподаватель'])
    }

    if user_data['role'] == 'Студент':
        group_name = random.choice(group_names)
        user_data['group'] = group_name;
    
    user_result = db.users.insert_one(user_data)
    user_id = user_result.inserted_id

    # Создаем объект студента с id, name и email
    student_data = {
        'id': str(user_id),
        'name': user_data['username'],
        'email': user_data['email']
    }
    
    # Случайное добавление пользователя в одну из групп, если он студент
    if user_data['role'] == 'Студент':
        db.groups.update_one({'name': group_name}, {'$push': {'students': student_data}})

print("Data has been inserted successfully.")
