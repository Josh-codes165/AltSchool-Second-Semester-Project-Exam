import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { todosApi } from "../Services/api.js";
import TodoItem from "./TodoItem.js";
import Pagination from "./Pagination.js";
import SearchFilter from "./SearchFilter.js";
import TodoModal from "./TodoModel.js";
import DeleteConfirmModal from "./DeleteConfirmModel.js";
import "../Styles/ToDoList.css";

export interface Todo {
  id: string
  title: string;
  description?: string;
  completed: boolean;
  status?: string;
}

interface ApiResponse {
  data: Todo[];
}

function TodoList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  // Fetch all todos
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["allTodos"],
    queryFn: () => todosApi.getAllTodos(),
    staleTime: 1000 * 60 * 5,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTodos"]} );
      setIsModalOpen(false);
      alert("Todo created successfully!");
    },
    onError: (error) => {
      alert(`Failed to create todo: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: {id: string; data: Partial<Todo>}) => todosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:["allTodos"]});
      setIsModalOpen(false);
      setEditingTodo(null);
      alert("Todo updated successfully!");
    },
    onError: (error) => {
      alert(`Failed to update todo: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: todosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTodos"] });
      setIsDeleteModalOpen(false);
      setDeletingTodo(null);
      alert("Todo deleted successfully!");
    },
    onError: (error) => {
      alert(`Failed to delete todo: ${error.message}`);
    },
  });

  // Filter and paginate locally
  const { filteredTodos, totalPages } = useMemo(() => {
    if (!data?.data) return { filteredTodos: [], totalPages: 1 };

    let todos = data.data;

    // Search filter
    if (searchTerm) {
      todos = todos.filter((todo) =>
        todo.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    // Change lines 93-97 to this:
    if (statusFilter === "complete") {
      todos = todos.filter(
        (todo) => todo.completed === true || todo.status === "DONE",
      );
    } else if (statusFilter === "incomplete") {
      todos = todos.filter(
        (todo) => todo.completed === false || todo.status === "TODO",
      );
    }

    // Calculate pagination
    const totalPages = Math.ceil(todos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTodos = todos.slice(startIndex, startIndex + itemsPerPage);

    return { filteredTodos: paginatedTodos, totalPages };
  }, [data?.data, searchTerm, statusFilter, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleToggleTodo = (todo: Todo) => {
    // We send the ID separately from the data object
    updateMutation.mutate({
      id: todo.id,
      data: {
        title: todo.title, // Use the existing title
        description: todo.description ?? "",
        completed: !todo.completed, // Flip the status
      },
    });
  };

  const handleCreateTodo = (formData: Partial<Todo>) => {
    createMutation.mutate(formData);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleUpdateTodo = (formData: Partial<Todo>) => {
    if (editingTodo) {
      updateMutation.mutate({ id: editingTodo.id, data: formData });
    }
  };

  const handleDeleteClick = (todo: Todo) => {
    setDeletingTodo(todo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTodo) {
      deleteMutation.mutate(deletingTodo.id);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" aria-label="Loading todos"></div>
        <p>Loading todos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container" role="alert">
        <h2>Error loading todos</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <header className="todo-header">
        <h1>My Todos</h1>
        <p>Manage your tasks efficiently</p>
        <button onClick={handleOpenCreateModal} className="create-todo-btn">
          + Create New Todo
        </button>
      </header>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <p>No todos found matching your criteria.</p>
          {(searchTerm || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <section className="todos-grid">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteClick}
                onToggle={handleToggleTodo}
              />
            ))}
          </section>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
        todo={editingTodo}
        mode={editingTodo ? "edit" : "create"}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTodo(null);
        }}
        onConfirm={handleConfirmDelete}
        todoTitle={deletingTodo?.title || ""}
      />
    </div>
  );
}

export default TodoList;
