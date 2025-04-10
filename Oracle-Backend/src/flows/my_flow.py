# flows/my_flow.py
from prefect import flow, task

@task
def say_hello(name: str) -> str:
    return f"Hello, {name}!"

@flow
def hello_flow(name: str):
    greeting = say_hello(name)
    print(greeting)

if __name__ == "__main__":
    hello_flow("World")
