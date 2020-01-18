import { TestBed } from '@angular/core/testing';

import { MessageSupportTeamService } from './message-support-team.service';

describe('MessageSupportTeamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageSupportTeamService = TestBed.get(MessageSupportTeamService);
    expect(service).toBeTruthy();
  });
});
