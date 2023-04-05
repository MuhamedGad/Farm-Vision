import 'package:flutter/material.dart';
import '../../../components/components.dart';
import '../../../constant/constants.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../home/home_screen.dart';

// ignore: must_be_immutable
class FirstPageSlider extends StatelessWidget {
  FirstPageSlider({Key? key, required this.controllerPageSlider})
      : super(
          key: key,
        );
  PageController controllerPageSlider = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(0, 10, 0, 0),
          child: Container(
            width: double.infinity,
            height: 500,
            decoration: const BoxDecoration(
              borderRadius: BorderRadius.only(
                  bottomRight: Radius.circular(40),
                  bottomLeft: Radius.circular(40)),
              image: DecorationImage(
                image: AssetImage('assets/images/1.png'),
                fit: BoxFit.contain,
              ),
            ),
            child: Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.only(right: 5, top: 50),
                child: TextButton(
                    onPressed: () => navigateTo(context, const HomeScreen()),
                    child: const Text(
                      "SKiP",
                      style: TextStyle(
                          color: skipColorButton,
                          fontSize: 24,
                          fontFamily: 'switzer'),
                    )),
              ),
            ),
          ),
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
                        "  \t\t\t\t\t\tGood morning /afternoon everyone .Today,\n  I am here to discuss plant disease detection and\n  our innovative solution that leverages object\n  detection technology to provide accurate.",
                    style: TextStyle(
                        overflow: TextOverflow.ellipsis,
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
              child: const Text(
                "Next",
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'switzer'),
              )),
        )
      ]),
    );
  }
}
