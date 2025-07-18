// Copyright (c) 2019 Uber Technologies, Inc.
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

import { ApiError } from './api-error';
import { fetchedState } from '../constants';
import { TDdgModel } from '../model/ddg/types';

export type TDdgStateEntry =
  | {
      state: typeof fetchedState.LOADING;
    }
  | {
      error: ApiError;
      state: typeof fetchedState.ERROR;
    }
  | {
      model: TDdgModel;
      state: typeof fetchedState.DONE;
      viewModifiers: Map<number, number>;
    };

type TDdgState = Record<string, TDdgStateEntry>;

export default TDdgState;
