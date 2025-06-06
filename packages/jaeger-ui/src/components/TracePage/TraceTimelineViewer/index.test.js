// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';

import TraceTimelineViewer, { TraceTimelineViewerImpl } from './index';
import * as KeyboardShortcuts from '../keyboard-shortcuts';
import traceGenerator from '../../../demo/trace-generators';
import transformTraceData from '../../../model/transform-trace-data';
import TimelineHeaderRow from './TimelineHeaderRow';

jest.mock('./VirtualizedTraceView', () => () => <div data-testid="virtualized-trace-view-mock" />);

describe('<TraceTimelineViewer>', () => {
  const trace = transformTraceData(traceGenerator.trace({}));
  const props = {
    trace,
    textFilter: null,
    viewRange: {
      time: {
        current: [0, 1],
      },
    },
    spanNameColumnWidth: 0.5,
    expandAll: jest.fn(),
    collapseAll: jest.fn(),
    expandOne: jest.fn(),
    collapseOne: jest.fn(),
  };
  const options = {
    context: {
      store: {
        getState() {
          return { traceTimeline: { spanNameColumnWidth: 0.25 } };
        },
        subscribe() {},
        dispatch() {},
      },
    },
  };

  let wrapper;
  let connectedWrapper;

  beforeEach(() => {
    wrapper = shallow(<TraceTimelineViewerImpl {...props} />, options);
    connectedWrapper = shallow(<TraceTimelineViewer store={options.context.store} {...props} />, options);
    jest.spyOn(KeyboardShortcuts, 'merge');
  });

  afterEach(() => {
    KeyboardShortcuts.merge.mockRestore();
  });

  it('it does not explode', () => {
    expect(wrapper).toBeDefined();
    expect(connectedWrapper).toBeDefined();
  });

  it('it sets up actions', () => {
    const headerRow = wrapper.find(TimelineHeaderRow);
    headerRow.props().onCollapseAll();
    headerRow.props().onExpandAll();
    headerRow.props().onExpandOne();
    headerRow.props().onCollapseOne();
    expect(props.collapseAll.mock.calls.length).toBe(1);
    expect(props.expandAll.mock.calls.length).toBe(1);
    expect(props.expandOne.mock.calls.length).toBe(1);
    expect(props.collapseOne.mock.calls.length).toBe(1);
  });

  it('it should call mergeShortcuts with the correct callbacks on mount', () => {
    render(<TraceTimelineViewerImpl {...props} />);
    expect(KeyboardShortcuts.merge).toHaveBeenCalledWith({
      collapseAll: expect.any(Function),
      expandAll: expect.any(Function),
      collapseOne: expect.any(Function),
      expandOne: expect.any(Function),
    });
  });

  it('it should call mergeShortcuts when callback props change', () => {
    const { rerender } = render(<TraceTimelineViewerImpl {...props} />);
    KeyboardShortcuts.merge.mockClear();

    const newCollapseAll = jest.fn();
    rerender(<TraceTimelineViewerImpl {...props} collapseAll={newCollapseAll} />);

    expect(KeyboardShortcuts.merge).toHaveBeenCalledWith({
      collapseAll: expect.any(Function),
      expandAll: expect.any(Function),
      collapseOne: expect.any(Function),
      expandOne: expect.any(Function),
    });
  });
});
