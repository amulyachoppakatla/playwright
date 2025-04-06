Feature: Login

  Scenario: User logs in successfully
    Given I open the login page
    When I login with valid credentials
    Then I should see the dashboard
