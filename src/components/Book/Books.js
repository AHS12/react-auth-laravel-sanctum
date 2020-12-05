import React from 'react';
import apiClient from '../../coreServices/api';

const Books = (props) => {
    const [books, setBooks] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    React.useEffect(() => {
        if (props.loggedIn) {
            apiClient.get('/api/books')
                .then(response => {
                    setBooks(response.data)
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        console.log(error);
                    } else {
                        console.error(error);
                    }
                });

        }
        apiClient.get('/api/users')
            .then(response => {
                setUsers(response.data)
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    console.log(error);
                } else {
                    console.error(error);
                }
            });
    }, [props.loggedIn]);

     /**
     * @name bookList
     * @role map the book objects into react components
     * @param Book object
     * @return  book rencer list
     *
     */

    const bookList = books.map((book) =>
        <div key={book.id}
            className="list-group-item"
        >
            <h5>{book.title}</h5>
            <small>{book.author}</small>
        </div>
    );

    const usersList = users.map((user) =>
        <div key={user.id}
            className="list-group-item"
        >
            <h5>{user.name}</h5>
            <small>{user.email}</small>
        </div>
    );

    if (props.loggedIn) {
        return (
            <div className="row">
                <div className="col-md-6 col-sm-6">
                    <h4>Books</h4>
                    <div className="list-group">{bookList}</div>
                </div>
                <div className="col-md-6 col-sm-6">
                    <h4>Users</h4>
                    <div className="list-group">{usersList}</div>
                </div>

            </div>

        );
    }
    return (
        <div>
            <div className="alert alert-warning">You are not logged in.Login Or Register To see Books!</div>
            <div className="list-group">{usersList}</div>
        </div>

    );
};

export default Books;