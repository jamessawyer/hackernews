import React, { Component } from 'react';
import Button from './Button';
import Search from './Search';
import Table from './Table';
import Loading from './Loading';
import {
    DEFAULT_QUERY,
    DEFAULT_PAGE,
    PATH_BASE,
    PATH_SEARCH,
    PARAM_SEARCH,
    PARAM_PAGE
} from './constants';
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          results: null,
          searchKey: '',
          searchTerm: DEFAULT_QUERY,
          isLoading: false,
      };

      this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
      this.setSearchTopStories = this.setSearchTopStories.bind(this);
      this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
      this.onSearchSubmit = this.onSearchSubmit.bind(this);
      this.onDismiss = this.onDismiss.bind(this);

  }
  // 是否需要再搜索
  needsToSearchTopStories(searchTerm) {
      return !this.state.results[searchTerm];
  }
  setSearchTopStories(result) {
      const { hits, page } = result;
      const { searchKey, results } = this.state;

      const oldHits = results && results[searchKey]
        ? results[searchKey].hits
        : [];

      const updatedHits = [
          ...oldHits,
          ...hits
      ];

      this.setState({
          results: {
              ...results,
              [searchKey]: { hits: updatedHits, page }
          },
          isLoading: false
      });
  }
  fetchSearchTopStories(searchTerm, page) {
      this.setState({ isLoading: true });

      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
          .then(response => response.json())
          .then(result => this.setSearchTopStories(result));
  }
  onSearchSubmit(event) {
      event.preventDefault();
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      if (this.needsToSearchTopStories(searchTerm)) {
          this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
      }
  }
  onSearchChange(event) {
      this.setState({
          searchTerm: event.target.value
      });
  }
  onDismiss(id) {
      const { searchKey, results } = this.state;
      const { hits, page } = results[searchKey];

      const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);
      this.setState({
          results: { ...results, [searchKey]: {hits: updatedHits, page } }
      });
  }

  componentDidMount() {
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }
  render() {
    const {
        results,
        searchTerm,
        searchKey,
        isLoading,
    } = this.state;

    // 获取页面页数
    const page = (
        results &&
        results[searchKey] &&
        results[searchKey].page) || 0;

    const list = (
        results &&
        results[searchKey] &&
        results[searchKey].hits
    ) || [];

    return (
      <div className="page">
          <div className="interactions">
              <Search
                  value={searchTerm}
                  onChange={this.onSearchChange}
                  onSubmit={this.onSearchSubmit}
              >
                  搜索
              </Search>
          </div>
          <Table
              list={list}
              onDismiss={this.onDismiss}
          />
          <div className="interactions">
              { isLoading
                  ? <Loading />
                  :  <Button
                      className="button-primary"
                      onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
                  >
                      更多
                  </Button>
              }

          </div>
      </div>
    );
  }
}

export default App;
