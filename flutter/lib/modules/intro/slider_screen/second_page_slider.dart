import 'package:flutter/material.dart';
import '../../../components/components.dart';
import '../../../constant/constants.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../home/home_screen.dart';

// ignore: must_be_immutable
class SecondPageSlider extends StatelessWidget {
  SecondPageSlider({Key? key, required this.controllerPageSlider})
      : super(key: key);
  PageController controllerPageSlider = PageController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(children: [
        Container(
          width: double.infinity,
          height: 500,
          decoration: const BoxDecoration(
            borderRadius: BorderRadius.only(
                bottomRight: Radius.circular(40),
                bottomLeft: Radius.circular(40)),
            image: DecorationImage(
                image: AssetImage('assets/images/2.png'),
                fit: BoxFit.contain,
                alignment: Alignment.center),
          ),
          child: Align(
            alignment: Alignment.topRight,
            child: Padding(
              padding: const EdgeInsets.only(right: 5, top: 50),
              child: TextButton(
                  onPressed: () => navigateTo(context, const HomeScreen()),
                  child: const Text(
                    "Skip",
                    style: TextStyle(
                        color: skipColorButton,
                        fontSize: 24,
                        fontFamily: 'switzer'),
                  )),
            ),
          ),
        ),
        const SizedBox(
          height: 20,
        ),
        Column(
          children: [
            Stack(
              children: [
                RichText(
                  text: const TextSpan(children: [
                    TextSpan(
                        text:
                            'We love helping you to safe \n \t\t\t\t\t\t\t\t\t\t\tthe ',
                        style: TextStyle(
                            color: Colors.black,
                            fontFamily: 'geometric',
                            fontSize: 30)),
                    TextSpan(
                        text: 'Earth\n',
                        style: TextStyle(
                            color: Color(0xffFF7029),
                            fontFamily: 'geometric',
                            fontSize: 30)),
                  ]),
                ),
                Positioned(
                    right: 150,
                    top: 70,
                    child: SvgPicture.asset('assets/images/Vector.svg')),
              ],
            ),
            RichText(
                text: const TextSpan(
                    text:
                        "     we help realize your dreams in making a garden   \n , let's start with small things that can change the \n world, so you can enjoy the fresh air forever",
                    style: TextStyle(
                        color: descriptionTextColor,
                        fontSize: 18,
                        fontFamily: 'gillsans')))
          ],
        ),
        const Spacer(),
        GestureDetector(
          onTap: () {
            controllerPageSlider.nextPage(
                duration: const Duration(microseconds: 750),
                curve: Curves.fastLinearToSlowEaseIn);
          },
          child: Container(
            alignment: Alignment.center,
            margin: const EdgeInsets.only(left: 30, right: 30, bottom: 20),
            width: 250,
            height: 50,
            decoration: BoxDecoration(
              color: Colors.green,
              borderRadius: BorderRadius.circular(15),
            ),
            child: TextButton(
              onPressed: () {
                controllerPageSlider.nextPage(
                    duration: const Duration(microseconds: 750),
                    curve: Curves.fastLinearToSlowEaseIn);
              },
              child: const Text(
                "Next",
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'switzer'),
              ),
            ),
          ),
        )
      ]),
    );
  }
}
