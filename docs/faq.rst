.. Minimal-Clock documentation master file, created by
   sphinx-quickstart on Fri Dec 14 15:22:30 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

FAQ/Bugs
=========================================

The weather will not update and only displays "``--``" instead?
---------------------------------------------------------------

Sometimes the weather display can be bit fickle.  For it to work it requires
a combination of things:

- Your phone needs to have both a GPS and Internet connection.
- The Fitbit app needs to be currently running on your phone (at least in the background)
- You must have approved the Location & Internet permissions when installing the Clockface.

If the display keeps being stuck on ``--`` check the following things:

Is the Fitbit app currently running in the background on your phone?
********************************************************************

If you're habitually swiping all open apps closed and you also fully close the Fitbit app,
the weather data can not be updated.

Keep the Fitbit app on your phone open and force the Clockface to reload. The easiest way to do this
is swiping up from bottom to top on the Clockface to show the Fitbit stats.

When you now close this stats page the Clockface will reload. Does it work now? If not, check the next thing:

Are the location services on your phone enabled and did you not allow Fitbit to use it?
***************************************************************************************

The location is needed for the weather display to find out where you currently are.
Check whether the location service is enabled on your phone and check whether you have given
the Fitbit app on your phone the permissions needed to access the location while being in the background.


After checking the permissions, force the Clockface to reload Does it work now? Nope? On to the next check:

Did you give this Clockface the permissions to access the Internet & Location
***************************************************************************************

Similarly to how you need to give your Fitbit phone app the permissions to access the location,
you also have to keep the boxes for internet & location access checked when installing the Clockface.

If you are not sure whether you did this you can uninstall and reinstall the Clockface through your
Fitbit app and see whether this fixes the problem when you now refresh the Clockface.

Did this solve the problem?

Actually, it didn't!
********************

That's strange, there seems to be something wrong with the Clockface indeed. Please get in touch
via bgreshake@gmail.com and we can figure out what's going on!

What's that weird/grey white bar on top of the clock face?
----------------------------------------------------------

This bar displays your current battery level. If your Versa is fully charged the
bar will span over the whole display length and it will slowly become smaller
and crawl towards the left side as your Versa's battery discharges.
Once the Battery level is at around 20% the bar should turn red, informing you that it's
time to charge the Versa soon.
