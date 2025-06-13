# Memory Capsule Feature Implementation

# Immediate Implementation

## Overall Design

* Ensure the headers on all pages are consistent with current Dashboard and Timeline screens

## Onboarding

* When users first create an account, they should be prompted to add their birthday and gender  
* Have users select an overall privacy setting for all their info: public, unlisted (with option for password protection), or private

## Capsule Creation

* Capsule creation should always include all of the following: record video, record audio, journal entry (text), add photos & videos  
* Ability to select multiple photos and videos, plus add a text/journal entry and/or audio or video response *before* saving a capsule  
* Ability to add additional data to photos/videos uploaded: description, date of photo (different than date uploaded)  
* Ability to add a title to each capsule created  
* Ability to add tags to capsules  
  * Create a list of “standard” tags, and allow users to create their own  
* Ability to add capsules to a category

## Dashboard

* Change “Record a Memory” title to “Create a Capsule”  
  * Remove the “Capture and preserve your moments” sub heading  
  * Insert “Give Your Capsule a Title” text field   
  * Insert “Start with Photos & Videos” section, allowing users to add as many as 20 images / videos from their photo library to a capsule  
* Add new “Suggested Capsules” section underneath the quick create section  
  * This suggested capsules section will include collections of photos (ideally linked to locations, people, vacation trips, or anything that can be tied to Apple/Android photos suggestions)  
* Switch “Today’s Memory Prompt” section with “Recent Activity” section  
  * In this section, be sure to include a “Add Photos & Videos” to the response options  
* Add total capsules stats on the dashboard: number of capsules created, images uploaded, video responses, audio responses, and journal entries

## Timeline Screen

* Ability to view capsules by latest activity (when users uploaded or responded to capsules) or event timeline (the actual date/year the events happened)  
* Capsules should be shown with their title and a smaller “gallery style” preview of the capsule, including several thumbnail images, previews of journal entries, and the first 3-5 seconds of video journal responses  
* Capsules showing in the timeline should say “Last updated on \[ACTIVITY DATE\].”  
* Clicking on a capsule directs users to a fuller view of the capsule (“Capsule View”)  
* Ability to filter capsules by tags  
* Ability to filter capsules by people  
* Ability to filter capsules by location  
* Ability to filter capsules by category (mirrors categories in the capsules page)  
  * Change the current “All Capsules” button to a “Categories” button/dropdown  
* Implement date picker to allow users to filter capsules based on date range  
  * User can select whether the date range applies to the event/capsule date or the user activity date (when the capsule was created, updated, etc.)

## Capsules Screen

* Ensure heading formatting matches Timeline screen  
* Insert section at top for “Create a Capsule” (mirrors the dashboard functionality)  
* Insert “Suggested Capsules” (mirrors dashboard functionality)  
* Insert title “Capsule Categories”  
* Change the design of each category to be more of a card than a row  
  * Change background color of each category icon to the purple gradient with white icon  
  * Include number of capsules created in each category, along with number of available and completed prompts  
* Clicking on any of the categories allows users to see  
  * Capsules they have already created in the category  
  * Available prompts for creating new capsules  
  * Ability to “Create a Capsule” from within the category (mirrors dashboard functionality and automatically includes in this category)

## Capsule View Screen

* When viewing a capsule, users can view capsule by activity date, event date, or by type of media (uploaded photos/videos, video response, audio response, journal entry)  
* Users can add additional photos, videos, video responses, audio responses, or journal entries at any point (no limit to number of items in a capsule)  
* Clicking on an image or video that has been uploaded brings users to a metadata view, where they can see:  
  * Date uploaded  
  * Date of Photo (user input, can input by year, month, and date \[optional\])  
  * Description (user input long form text)  
  * People  
    * User can tag people in a photo by clicking on faces  
    * When tagging people for the first time   
  * Tags  
* Implement a “Save” button to save metadata  
  * Saving metadata brings users back to the capsule view screen  
* All metadata can be searched for in the timeline or capsules screen  
* Always implement a “Back” button to return to whatever screen the user entered the capsule view from

## Settings Screen

* Ensure proper header design  
* Pull actual user data  
* Allow user to upload a profile picture  
* Implement profile information  
  * Date of birth  
  * Gender  
* Implement “Manage People” section  
  * Allows users to see all people in their library, along with number of photos/videos and capsule the person is in  
* Implement “Manage Tags” section  
  * Allows users to manage all tags, including renaming, adding, or deleting tags  
    * Warning when users attempt to delete a tag that is associated with capsules/assets