class TodosController < ApplicationController
  def index
    todos = Todo.order("created_at DESC")
    render json: todos
  end

  def create
    todo = Todo.create(todo_param)
    render json: todo
  end

  def update
    todo = Todo.find(params[:id])
    todo.update(done: params[:todo][:done])
    render json: todo
  end

  def destroy
    todo = Todo.find(params[:id])
    todo.destroy
    head :no_content, status: :ok
  end

  def filterByStatus
    todos = Todo.filter_by_status(params[:status])
    render json: todo
  end
  
  private
    def todo_param
      params.require(:todo).permit(:title, :done)
    end
end