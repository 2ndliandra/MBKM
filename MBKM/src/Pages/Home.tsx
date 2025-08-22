import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Check, X, Filter } from 'lucide-react';

// Types
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category: string;
}

type FilterType = 'all' | 'active' | 'completed';
type CategoryType = 'work' | 'personal' | 'shopping' | 'other';

const TodoApp: React.FC = () => {
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('other');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');


  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const categories: { value: CategoryType; label: string; color: string }[] = [
    { value: 'work', label: '💼 Work', color: 'bg-blue-100 text-blue-800' },
    { value: 'personal', label: '🏠 Personal', color: 'bg-green-100 text-green-800' },
    { value: 'shopping', label: '🛒 Shopping', color: 'bg-purple-100 text-purple-800' },
    { value: 'other', label: '📝 Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
     const handleLogout = async () => {
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userToken');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('jwt');
            
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('userSession');

             document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos) : c;
            if (name.includes('token') || name.includes('auth')) {
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }

            setIsLoggedIn(false);
            alert('Logout berhasil! Token telah dihapus.');
        });
        } catch(error) {
           console.error('Error during logout:', error);
          alert('Terjadi kesalahan saat logout');
        } finally { setIsLoading (false) }
     }
  }

  const addTodo = () => {
    if (inputText.trim() === '') {
      alert('Please enter a todo item!');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date(),
      category: selectedCategory
    };

    setTodos(prev => [newTodo, ...prev]);
    setInputText('');
  };

  const deleteTodo = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') {
      alert('Todo cannot be empty!');
      return;
    }

    setTodos(prev => prev.map(todo =>
      todo.id === editingId ? { ...todo, text: editText.trim() } : todo
    ));
    
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    else if (e.key === 'Escape') cancelEdit();
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[3];
  };

  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };

  const stats = getStats();

  

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-400 bg-gradient-to-r from-[#3E5F44] to-[#151f16] shadow-lg">
        <div className="container mx-auto px-10 py-5">
          <h2 className="h-auto text-lg text-white font-bold">TODO-APP</h2>

        </div>
        <button className="flex flex-row px-[10px] rounded-[5px] h-[40px] cursor-pointer transition-all duration-300 bg-[#3E5F44] hover:bg-[#2d4532] text-white items-center absolute right-[35px] top-2">
            <i className="fas fa-sign-out-alt text-[12px] mr-2"></i>
            <span>Logout</span>
        </button>
      </header>

      <main className="container mx-auto px-5 py-15 max-w-4xl">
        
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 ">Add New Task</h2>

         <div className="flex justify-end gap-5 ">
          <div className="bg-[#d0e2f8] rounded-lg p-6 mb-5 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600 font-medium">Total Tasks</div>
          </div>
          <div className="bg-[#ffbfb4] rounded-lg p-6 mb-5 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.active}</div>
            <div className="text-sm text-gray-600 font-medium">Active Tasks</div>
          </div>
          <div className="bg-[#c6ffaf] rounded-lg p-6 mb-5 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.completed}</div>
            <div className="text-sm text-gray-600 font-medium">Completed</div>
          </div>
        </div>

          <div className="space-y-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Category
              </label>
              <div className="flex gap-3 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.value
                        ? category.color + ' ring-2 ring-blue-300 shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What needs to be done?"
                  className="w-full px-5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addTodo}
                  className="bg-[#3E5F44] hover:bg-[#2d4532] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-center gap-4 mt-5 mb-5">
          {(['all', 'active', 'completed'] as FilterType[]).map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-2 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 shadow-sm ${
                filter === filterType
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <Filter size={16} />
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              <span className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded-full ml-1">
                {filterType === 'all' ? stats.total : 
                 filterType === 'active' ? stats.active : 
                 stats.completed}
              </span>
            </button>
          ))}
        </section>

        <section className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <div className="text-7xl mb-6">🎉</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {filter === 'completed' ? 'No completed tasks yet!' : 
                 filter === 'active' ? 'No active tasks!' : 
                 'No tasks yet!'}
              </h3>
              <p className="text-gray-600 text-lg">
                {filter === 'all' }
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => {
              const categoryInfo = getCategoryInfo(todo.category);
              return (
                <div
                  key={todo.id}
                  className={`bg-white rounded-lg shadow-md p-5 transition-all duration-300 hover:shadow-lg border border-gray-100 ${
                    todo.completed ? 'opacity-75 bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">

                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white shadow-md'
                          : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                      }`}
                    >
                      {todo.completed && <Check size={16} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={handleEditKeyPress}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <div className={`font-medium text-lg mb-2 ${
                            todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}>
                            {todo.text}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                              {categoryInfo.label}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              Added: {todo.createdAt.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {editingId === todo.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            title="Save changes"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            title="Cancel editing"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(todo.id, todo.text)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            title="Edit task"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            title="Delete task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

      </main>
    </div>
  );
};

export default TodoApp;
