from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)  # Интервал между запросами каждого пользователя

    @task(1)
    def get_projects(self):
        # Запрос на получение списка всех проектов
        self.client.get("/projects")

    @task(2)
    def get_project_by_id(self):
        # Запрос на получение проекта по ID
        project_id = "65fd7600517a75b9c1ec2520"  # Пример ID проекта
        self.client.get(f"/projects/{project_id}")

    @task(1)
    def get_projects_by_group(self):
        # Запрос на получение проектов по группе
        group_id = "65e6f4002818f1e35642a6d1"  # Пример ID группы
        self.client.get(f"/projects/group/{group_id}")
