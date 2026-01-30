import { vi } from 'vitest'
import * as exports from './mocking'

vi.spyOn(exports, 'getter', 'get')