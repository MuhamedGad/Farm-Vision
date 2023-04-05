import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:smartfarm/modules/home/page_view/pageview_destination_list.dart';
import '../../config/constants.dart';
import '../../config/route/scale_route.dart';
import '../profile/edit_profile.dart';
import 'bottom_navigation/my_bottom_navigation.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(children: [
          const SizedBox(
            height: 15,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 50, left: 15, right: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                        context, ScaleRoute(page: const EditProfile()));
                  },
                  child: Container(
                    margin: const EdgeInsets.only(top: 18, left: 2, right: 5),
                    padding: const EdgeInsets.all(5),
                    height: 55,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFEFEF),
                      borderRadius: BorderRadius.circular(60),
                    ),
                    child: Row(children: const [
                      CircleAvatar(
                        backgroundImage: AssetImage("assets/images/cut.jpeg"),
                      ),
                      SizedBox(
                        width: 15,
                      ),
                      Text(
                        "Mohamed",
                        style: TextStyle(
                          fontFamily: "geometric",
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        "   ",
                        style: TextStyle(
                          fontFamily: "geometric",
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ]),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(
            height: 50,
          ),
          Padding(
            padding: const EdgeInsets.only(left: 20),
            child: Align(
              alignment: Alignment.topLeft,
              child: Stack(
                children: [
                  RichText(
                    text: const TextSpan(children: [
                      TextSpan(
                          text: 'Explorer the\n',
                          style: TextStyle(
                              color: Colors.black,
                              fontFamily: 'SFdisplay',
                              fontSize: 40)),
                      TextSpan(
                          text: 'Beautiful ',
                          style: TextStyle(
                              color: Colors.black,
                              fontFamily: 'geometric',
                              fontSize: 40)),
                      TextSpan(
                          text: 'World\n',
                          style: TextStyle(
                              color: Color(0xffFF7029),
                              fontFamily: 'geometric',
                              fontSize: 40)),
                    ]),
                  ),
                  Positioned(
                    right: 20,
                    top: 95,
                    child: SvgPicture.asset('assets/images/Vector.svg'),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 17, right: 17),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "History",
                  style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                ),
                GestureDetector(
                  onTap: () {
                    Navigator.of(context).pushNamed('/listviewitem');
                  },
                  child: const Text("View all",
                      style:
                          TextStyle(fontSize: 15, color: activeColorIndicator)),
                )
              ],
            ),
          ),
          const SizedBox(
            height: 10,
          ),
          const PageViewDestinationList(),
        ]),
      ),
      bottomNavigationBar: Container(
          decoration: BoxDecoration(
              color: const Color.fromARGB(26, 189, 189, 189),
              borderRadius: BorderRadius.circular(40)),
          child: const MyBottomNavigationBar()),
    );
  }
}
