import React, { Component } from "react";
import { Route } from "react-router-dom";
import AddBookmark from "./AddBookmark/AddBookmark";
import BookmarkList from "./BookmarkList/BookmarkList";
import BookmarksContext from "./BookmarksContext";
import Nav from "./Nav/Nav";
import config from "./config";
import Rating from "./Rating/Rating";
import "./App.css";
import EditBookmark from "./EditBookmark";

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = (bookmarks) => {
    this.setState({
      bookmarks,
      error: null,
    });
  };

  addBookmark = (bookmark) => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark],
    });
  };

  deleteBookmark = (bookmarkId) => {
    const newBookmarks = this.state.bookmarks.filter(
      (bm) => bm.id !== bookmarkId
    );
    this.setState({
      bookmarks: newBookmarks,
    });
  };

  editBookmark = (editedBookmark) => {
    const newBookmarks = this.state.bookmarks.map((bm) =>
      bm.id === editedBookmark.id ? editedBookmark : bm
    );
    this.setState({
      bookmarks: newBookmarks,
    });
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch((error) => this.setState({ error }));
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      editBookmark: this.editBookmark,
    };
    return (
      <main className="App">
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className="content" aria-live="polite">
            <Route path="/add-bookmark" component={AddBookmark} />
            <Route exact path="/" component={BookmarkList} />
            <Route path="/edit/:bookmarkId" component={EditBookmark} />
          </div>
          <Rating value={"5"} />
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
