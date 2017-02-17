import React, { Component } from 'react';
import { sortBy } from 'lodash';
import Sort from './Sort.js';
import Button from './Button';

// SORTS 对象包含多个排序函数
const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
    DATE: list => sortBy(list, 'created_at').reverse()
};

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortKey: 'NONE',
            isSortReverse: false,
        };
        this.onSort = this.onSort.bind(this);
    }
    onSort(sortKey) {
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({ sortKey, isSortReverse });
    }
    render() {
        const { list, onDismiss } = this.props;
        const { sortKey, isSortReverse } = this.state;

        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
        return (
            <div className="table">
                <div className="table-row table-title">
                    <span style={{ width: '40%' }}>
                        <Sort
                            sortKey={'TITLE'}
                            onSort={this.onSort}
                            activeSortKey={sortKey}
                        >
                             标题
                        </Sort>
                    </span>
                    <span style={{ width: '20%' }}>
                        <Sort
                            sortKey={'AUTHOR'}
                            onSort={this.onSort}
                            activeSortKey={sortKey}
                        >
                            作者
                        </Sort>
                    </span>
                    <span style={{ width: '10%' }}>
                        <Sort
                            sortKey={'COMMENTS'}
                            onSort={this.onSort}
                            activeSortKey={sortKey}
                        >
                            评论数
                        </Sort>
                    </span>
                    <span style={{ width: '10%' }}>
                        <Sort
                            sortKey={'POINTS'}
                            onSort={this.onSort}
                            activeSortKey={sortKey}
                        >
                            得分
                        </Sort>
                    </span>
                    <span style={{ width: '10%' }}>
                        <Sort
                            sortKey={'DATE'}
                            onSort={this.onSort}
                            activeSortKey={sortKey}
                        >
                            日期
                        </Sort>
                    </span>
                    <span style={{ width: '10%' }}></span>
                </div>
                {
                    reverseSortedList.map(item =>
                        <div key={item.objectID} className="table-row">
                          <span style={{ width: '40%' }}>
                              <a href={item.url}>{item.title}</a>
                          </span>
                            <span style={{ width: '20%' }}>{item.author}</span>
                            <span style={{ width: '10%' }}>{item.num_comments}</span>
                            <span style={{ width: '10%' }}>{item.points}</span>
                            <span style={{ width: '10%' }}>{item.created_at.slice(0,10)}</span>
                            <span style={{ width: '10%' }}>
                              <Button
                                  onClick={() => onDismiss(item.objectID)}
                                  className="button-inline"
                              >
                                  删除
                              </Button>
                          </span>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Table;
