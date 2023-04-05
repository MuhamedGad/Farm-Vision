import 'package:flutter/material.dart';
import 'modules/home/edit_profile/edit_profil.dart';
import 'modules/home/home_screen.dart';
import 'modules/home/list_view_item/listview_item.dart';
import 'modules/intro/intro_page.dart';
import 'modules/intro/splash_screen/splash_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Plant Detect',
      initialRoute: '/',
      routes: {
        "/": (context) => const SplashScreen(),
        "/intro": ((context) => IntroPage()),
        "/main": (context) => const HomeScreen(),
        "/listviewitem": (context) => const ListViewItem(),
        "/editprofile": (context) => const EditProfile()
      },
      theme: ThemeData(
        primarySwatch: Colors.green,
        fontFamily: 'SFdisplay',
      ),
    );
  }
}
