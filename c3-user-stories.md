Please edit this template and commit to the master branch for your user stories submission.   
Make sure to follow the *Role, Goal, Benefit* framework for the user stories and the *Given/When/Then* framework for the Definitions of Done! You can also refer to the examples DoDs in [C3 spec](https://sites.google.com/view/ubc-cpsc310-21w2-intro-to-se/project/checkpoint-3).

## User Story 1
As a UBC student, I want to be able to choose a department dataset from given options, so that I can access course info from departments that are of relevance to me.


#### Definitions of Done(s)
Scenario 1: Available department\
Given: The user is on the homepage at the "Choose Department" box\
When: The user chooses a valid department from the box and clicks "Confirm Selection"\
Then: The application indicates that the user chosen department can be queried in a green confirmation message

Scenario 2: Unavailable department\
Given: The user is on the homepage at the "Choose Department" box\
When: The user chooses an invalid department from the box and clicks "Confirm Selection"\
Then: The application indicates that the user chosen department can not be queried in a red error message telling the user that they have selected an invalid option and should try again

## User Story 2
As a UBC student, I want to be able to input a number and search for past courses that have an average higher than my chosen number within the most recently chosen department, so that I can find courses that are good GPA boosters.


#### Definitions of Done(s)
Scenario 1: Valid results\
Given: The user is on the homepage at the "Search for a GPA Booster" box\
When: The user enters a valid number than that can return valid results and clicks "Search"\
Then: The application returns a list of past courses that has an average higher than the user entered number within the most recently chosen department dataset

Scenario 2: Invalid results\
Given: The user is on the homepage at the "Search for a GPA Booster" box\
When: The user enters an invalid number than that can not return valid results and clicks "Search"\
Then: The application fails to return a list and shows a red error message, telling the user to try another number or another department

## Others
You may provide any additional user stories + DoDs in this section for general TA feedback.  
Note: These will not be graded.
