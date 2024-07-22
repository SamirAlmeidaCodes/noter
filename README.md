# noter

Noter is one of my first open-source projects.

I started this with the main intent of not only getting better at javascript but also with the whole organization processes in the file managar when coding a project.

I also wanted to develop a user system for the first time in javascript, as i already had done it in C++, C#, Python and PHP I also wanted to learn that here as i did.

Also learned how to develop a auto-saving system (which is crazy easy).

Overall this project not only helped me develop a lot my skills but also helped me getting a bigger eco-system for myself (and my future eco-system of Saas's) to use. Now i have a fully costumizable and synced notepad that isn't laggy as the one from Apple.

If you also want to use this project you should have a mysql database with 2 tables, the 'tbl_user' for users and 'tbl_notes' for notes.

In the 'tbl_users' it should have the 'user_id' with auto increment, the 'user', 'password' and 'notes' where 'notes' is a foreign key that will connect to the other column's id.

In the 'tbl_notes' it should have the 'note_id', text and 'user_id' which is the one that connects to the other column.

Having all of this setup should let you work with every code that there is here.

As this is fully open-source feel free to take the code and costumize it to satisfy your needs.
