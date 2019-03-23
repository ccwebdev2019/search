// import react for creating our components
import React from "react";
// import axios for creating request to the backend
import axios from "axios";
import config from "../../common/config";

// index stateful component
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      loading: false,
      data: [],
      empty: true,
      reg: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // on compnent mount get all the current documents
  componentDidMount() {
    axios
      .get(`${config.devUrl}/all`)
      .then(res => this.setState({ data: res.data }));
  }

  // if state changes get all the current documents
  componentDidUpdate(prevProp, prevState) {
    if (prevState.loading !== this.state.loading) {
      axios
        .get(`${config.devUrl}/all`)
        .then(res => setTimeout(() => this.setState({ data: res.data }), 2000));
    }
  }

  // our change method for the input
  handleChange(e) {
    const { name, value } = e.target;
    const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    if (value) {
      if (!urlRegex.test(value)) {
        this.setState({ [name]: value, reg: false, empty: false });
        return;
      }
      this.setState({ [name]: value, reg: true });
    } else {
      this.setState({ empty: true, reg: true });
    }
  }

  // our onSubmit method
  handleSubmit(e) {
    e.preventDefault();
    // update the state
    this.setState({ loading: true });
    axios.post(`${config.devUrl}/index`, { url: this.state.url }).then(res => {
      // update the state once promise resolves
      this.setState({ loading: false });
    });
  }
  render() {
    // store bool, it will help us with some visual aspects
    const loading = this.state.loading;
    // store the curren index count
    const indexCount =
      this.state.data.length > 0 ? this.state.data.length : null;
    const empty = this.state.empty;
    const regex = this.state.reg;
    return (
      <div className="container">
        {empty && (
          <small className="text-danger d-block">this field is required</small>
        )}
        {!regex && (
          <small className="text-danger d-block">
            format examples: https:// or http://.
          </small>
        )}
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="input-group mb-3">
            <input
              type="text"
              name="url"
              className="form-control"
              placeholder="type or paste url"
              onChange={this.handleChange}
              disabled={loading}
            />
            <div className="input-group-append">
              <input
                type="submit"
                value={loading ? "INDEXING..." : "index please"}
                className={loading ? "btn btn-primary px-2" : "btn btn-warning"}
                disabled={loading || empty || !regex}
              />
            </div>
          </div>
        </form>
        <div className="display">
          <h4>Total Indexed: {indexCount}</h4>
        </div>
      </div>
    );
  }
}

export default Index;
