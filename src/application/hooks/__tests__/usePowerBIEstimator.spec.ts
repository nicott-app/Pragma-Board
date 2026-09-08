import { renderHook, act } from '@testing-library/react';
import { usePowerBIEstimator } from '../usePowerBIEstimator';
import { vi, describe, it, expect } from 'vitest';

// Mock Zustand stores and Firebase
vi.mock('../../store/useProjectStore', () => ({
  useProjectStore: () => ({ id: 'p1', name: 'Test' })
}));

vi.mock('../../store/useUIStore', () => ({
  useUIStore: vi.fn(() => vi.fn())
}));

vi.mock('../../store/useToastStore', () => ({
  useToastStore: vi.fn(() => vi.fn())
}));

vi.mock('../../../infrastructure/firebase/FirebaseTicketRepository', () => {
  return {
    FirebaseTicketRepository: class {
      createTicket = vi.fn().mockResolvedValue(true)
    }
  }
});

describe('usePowerBIEstimator', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePowerBIEstimator());
    
    expect(result.current.qtyPages).toBe(3);
    expect(result.current.fAnalysis).toBe(1.0);
    expect(result.current.seniority).toBe(1.0);
    
    // Check initial total hours based on defaults
    // modelSubtotal = 8*1 + 8*1 = 16
    // etlHours = 2*4*1 = 8
    // daxHours = 10*2*1 = 20
    // visualsBase = (3*4)+(10*1.5)+(4*4)+(5*0.75)+(6*1)+(2*3)+(4*0.75)+(1*5) = 12+15+16+3.75+6+6+3+5 = 66.75
    // uiHours = round(66.75) = 67
    // devSubtotal = 16 + 8 + 20 + 67 = 111
    // rlsBase = 8 (since fRls=1.0 !== 0.8)
    // qaHours = round((111 * 0.15) + 8) = round(16.65 + 8) = 25
    // totalHours = 111 + 25 + 12 = 148
    expect(result.current.totalHours).toBe(148);
  });

  it('recalculates total hours when changing quantities', () => {
    const { result } = renderHook(() => usePowerBIEstimator());
    
    act(() => {
      result.current.setQtyPages(10);
      result.current.setSeniority(1.5);
    });

    // visualsBase changes because pages went from 3 to 10 (+7 * 4 = 28). New uiHours = 67 + 28 = 95
    // devSubtotal = 16 + 8 + 20 + 95 = 139
    // qaHours = round((139 * 0.15) + 8) = round(20.85 + 8) = 29
    // total = (139 + 29 + 12) * 1.5 = 180 * 1.5 = 270
    expect(result.current.totalHours).toBe(270);
  });
});
