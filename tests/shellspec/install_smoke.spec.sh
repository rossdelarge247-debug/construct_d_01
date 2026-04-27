Describe 'shellspec runner'
  It 'evaluates a simple expectation'
    When call true
    The status should be success
  End
End
