import React from "react";
import config from "./config.js";
import BookmarksContext from "./BookmarksContext";

class EditBookmark extends React.Component {
  static contextType = BookmarksContext;
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      url: "",
      description: "",
      rating: "",
      error: "",
    };
  }

  componentDidMount() {
    const { bookmarkId } = this.props.match.params;
    console.log("url", config.API_ENDPOINT + `/${bookmarkId}`);
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((response) => {
        console.log("response", response);
        this.setState({
          id: response.id,
          title: response.title,
          url: response.url,
          description: response.description,
          rating: response.rating,
        });
      })
      .catch((error) => this.setState({ error }));
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  updateFields = (newBookmark) => {
    this.setState({
      id: newBookmark.id,
      title: newBookmark.title,
      url: newBookmark.url,
      description: newBookmark.description,
      rating: newBookmark.rating,
    });
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { bookmarkId } = this.props.match.params;
    const { id, title, url, description, rating } = this.state;
    const newBookmark = { id, title, url, description, rating };

    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "PATCH",
      body: JSON.stringify(newBookmark),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));
      })
      .then(() => {
        this.updateFields(newBookmark);
        this.context.editBookmark(newBookmark);
        this.props.history.push("/");
      });
  };

  render() {
    const { title, url, description, rating, error } = this.state;
    return (
      <div>
        <h2>Edit Bookmark</h2>
        <form className="EditBookmark__form" onSubmit={this.handleSubmit}>
          <div className="EditBookmark__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              placeholder={title}
              onChange={(e) => this.handleChange(e)}
              required
            />
          </div>
          <div>
            <label htmlFor="url">URL</label>
            <input
              type="url"
              name="url"
              id="url"
              value={url}
              placeholder={url}
              onChange={(e) => this.handleChange(e)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder={description}
              value={description}
              onChange={(e) => this.handleChange(e)}
            />
          </div>
          <div>
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              name="rating"
              id="rating"
              placeholder={rating}
              value={rating}
              onChange={(e) => this.handleChange(e)}
              min="1"
              max="5"
              required
            />
          </div>
          <div className="EditBookmark__buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{" "}
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    );
  }
}

export default EditBookmark;
