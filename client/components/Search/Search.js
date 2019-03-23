// import react for creating components
import React from "react";
// import axios for making requests to the backend
import axios from "axios";
import config from "../../common/config";

// stateful component
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      loading: false,
      data: [],
      searchWord: "",
      empty: true,
      reg: true,
      completed: false
    };
    // bind method
    this.handleSubmit = this.handleSubmit.bind(this);
    // bind method
    this.handleChange = this.handleChange.bind(this);
  }

  // our onChange method for our input
  handleChange(e) {
    const { name, value } = e.target;
    const regex = /[a-z]{3,}/;
    if (value) {
      if (!regex.test(value)) {
        console.log(regex.test(value));
        this.setState({ [name]: value, empty: false, reg: false });
        return;
      }
      this.setState({ [name]: value, reg: true });
    } else {
      this.setState({ [name]: value, data: [], empty: true, completed: false });
    }
  }

  // our onSubmit method for the form
  handleSubmit(e) {
    e.preventDefault();
    // update state
    this.setState({ loading: true });
    // post request querying database for documents that have the search text
    axios
      .post(`${config.devUrl}/search`, {
        search: this.state.search
      })
      .then(res => {
        // destructuring the response object
        const {
          data: { data, searchWord }
        } = res;
        // updating the state once promise resolves
        setTimeout(
          () =>
            this.setState({
              data,
              searchWord,
              loading: false,
              completed: true
            }),
          2000
        );
      })
      .catch(error => console.log(error));
  }

  render() {
    const empty = this.state.empty;
    const regex = !empty && !this.state.reg;
    // store boolean, will help us with some animation interactions
    const loading = this.state.loading && this.state.search;
    // store boolean, it will help use render elements once we have data
    const displayLinks = this.state.data.length > 0;
    // get the number of times the search word appears on each document
    const ocurrences = str => {
      if (displayLinks) {
        return str.match(new RegExp(`${this.state.searchWord}`, "gi")).length;
      }
      return null;
    };
    return (
      <div className="container">
        {empty && (
          <small className="text-danger d-block">this field is required</small>
        )}
        {regex && (
          <small className="text-danger d-block">
            the word must be at least 3 char long
          </small>
        )}
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="input-group mb-3">
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="search documents with one word"
              onChange={this.handleChange}
              disabled={loading}
              value={this.state.search}
            />
            <div className="input-group-append">
              <input
                type="submit"
                value={loading ? "SEARCHING..." : "search please"}
                className={loading ? "btn btn-success px-2" : "btn btn-primary"}
                disabled={loading || empty || regex}
              />
            </div>
          </div>
        </form>
        <ul className="list-group">
          {!displayLinks && this.state.completed && <h2>We found nothing</h2>}
          {displayLinks &&
            this.state.data.map((el, i) => (
              <a className="my-2" href={el.url} target="_blank" key={i}>
                <li className="list-group-item d-flex justify-content-between">
                  {el.title}{" "}
                  <small className="text-secondary">
                    <strong>ocurrences</strong>:{" "}
                    <span className="font-weight-bold text-primary">
                      {ocurrences(el.data)}
                    </span>
                  </small>
                </li>
              </a>
            ))}
        </ul>
      </div>
    );
  }
}

export default Search;
