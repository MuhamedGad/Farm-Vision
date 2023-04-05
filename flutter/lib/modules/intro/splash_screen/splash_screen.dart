import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 1), () {
      Navigator.pushReplacementNamed(context, '/intro');
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color.fromARGB(255, 8, 142, 97),
      body: Center(
        child: Text(
          "Plant Detect Diseases",
          style: TextStyle(
            color: Colors.white,
            fontSize: 30,
            fontFamily: 'geometric',
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
