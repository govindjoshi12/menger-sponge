Govind Joshi (gvj84)
Albin Shrestha (as89652)

An explanation of any required features that you know are 
not working completely correctly, but would like to have 
considered for partial credit. Anything the milestone-specific 
specs below ask you to include.

    Menger Sponge
    Initially, we attempted to create the menger sponge
    by only recursively creating the bottom-front-right
    cube and translating to all the remaining 19 positions.
    However, I saw a strange pattern where there would only 
    be the one cube in each of the desired locations, 
    except for the bottom-front-right which looked filled
    with incorrect geometry, so the translation logic
    was incorrect, and appending new indicies seemed
    fishy as well. We ended up settling on recursively
    drawing every single cube, and while it is not blazing
    fast, 1-4 happen almost instantly, 5 takes a few seconds, 
    but beyond that, things start to slow down quite a bit. 
    I hope to work on speeding this up in the future because
    I really want to figure out how to correctly implement
    the translation code because that could speed up things
    by many factors.
    
    FPS
    To be honest, I'm still skeptical and unsure of how our
    current implementation works. It results in an almost 
    exact replica of the reference, but in my homogenous
    vector consisting of the vector calculated from the 
    difference in mouse position, the 4th element is set 
    to 0. From lecture, I remember that it is supposed to be
    1 in order to allow for adding the child system's origin
    to the resulting vector equation. Fortunately, the current
    implementation provides desired results. 

    onKeydown
    Implementing these were fairly simple once we understood 
    the basic idea of them. The wasd buttons modified the cameras
    offset in relation to the forward and right we were given.
    The arrow keys modified the camera up/down and rotates it.
    Each digit called the this.sponge.setLevel based on what 
    key number was pressed, etc.
    
    Shaders
    This was one of the most confusing parts of the lab because
    we had to read the documentaion on a new language. We had 
    issues with this part where the color for the checkerboard
    would give us green/black or blue/cyan. This wa because of 
    the way we had origianly implemented our shaders for the cube
    all of the top facing parts of the checkerboard would be modified
    by the top color of our cube. Originaly we were calculating the 
    color by the normal, but we later moved to using the location of 
    each vertex to find if the piece is white or black.

Bonus/Extra

    In terms of Bonus/Extra things we implmented for this
    lab we did a few diffrent things. First we added 'R', 'T', 
    'Y' buttons that let your reset back to the menger sponge
    in the x, y, and, z cordinates. We also added a Orbital 
    camera, which puts the user in a diffrent control system.
    
    We added number keys 6-9, which is still very slow, and 0
    which is useful for removing the cube. 
    
    And lastly, we added a scroll feature which uses the mouse
    scroll to adjust the users zoom. This feature makes the 
    project feel more fluid as if it is a real engine where 
    we have free control over. We used typescript's "Wheel Event"
    to implement this. It is important to note that we disabled
    the scrolling of the webpage by setting overflow to hidden 
    in the main css file (in the html class). 

    Note: We re-enabled the scrolling because it may be a 
    pain to look at our pictures and the reference pictures
    from the test suite without scroll.
    
    There is a point
    at which I belive the fov becomes negative when scrolling 
    backwards. We wanted to fix this with clamping, but the
    moving around in this "upside-down" state is really cool.
    I am wondering if that could be some clever new game mechanic
    where the main character could turn the world upside down 
    on will. Now that I type it out, it just seems like a gravity
    flip but I think there's some really cool things that can
    be done!
    