Put any generalized functions here. Ideally, these are pure functions which are testable.
Try to put any impure functions (those that have implicit dependencies like the DOM) with the 
other `glue` code. Entry points are a good place for this, since those will likely be loaded
and replace any code in a given `*.cshtml` file.